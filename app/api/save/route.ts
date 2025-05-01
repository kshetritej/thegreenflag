import prisma from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  const { businessId, userId } = await req.json();

  const savedBusiness = await prisma.favorite.create({
    data: {
      businessId,
      userId,
    },
  });
  return NextResponse.json(savedBusiness);
}

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const savedBusiness = await prisma.favorite.findMany({
    // @ts-expect-error it is assignable
    where: { userId: session.user?.id },
  });

  return NextResponse.json(savedBusiness);
}

export async function DELETE(req: NextRequest) {
  const { businessId, userId } = await req.json();
  const business = await prisma.favorite.findUnique({
    where: {
      userId_businessId: {
        userId,
        businessId,
      },
    },
  });

  if (!business) {
    throw new Error("Business not found");
  }

  await prisma.favorite.delete({
    where: {
      userId_businessId: {
        userId,
        businessId,
      },
    },
  });

  return NextResponse.json({ message: "Business removed from favorites" });
}