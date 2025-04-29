import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/prisma/prismaClient";

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = session.user as SessionUser;

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return new NextResponse("Business ID is required", { status: 400 });
    }

    // Verify that the business belongs to the user
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        ownerId: user.id,
      },
    });

    if (!business) {
      return new NextResponse("Business not found or unauthorized", { status: 404 });
    }

    const events = await prisma.event.findMany({
      where: {
        businessId,
        userId: user.id,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("[EVENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = session.user as SessionUser;

    const body = await request.json();
    const { title, description, startDate, endDate, businessId } = body;

    if (!title || !startDate || !endDate || !businessId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Verify that the business belongs to the user
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        ownerId: user.id,
      },
    });

    if (!business) {
      return new NextResponse("Business not found or unauthorized", { status: 404 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        businessId,
        userId: user.id,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 