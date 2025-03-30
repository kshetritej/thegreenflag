import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";

export async function GET(req: NextRequest) {
  const businesses = await prisma.business.findMany({
    include: {
      owner: true,
      reviews: true,
    },
  });
  return NextResponse.json(businesses);
}

export async function POST(req: NextRequest){
  const body = await req.json();
  const { establishedYear, mainImage, additionalImages, ...data } = body;

  const response = await prisma.business.create({
    data: {
      ...data,
      images: [mainImage, ...additionalImages],
      establishedYear: establishedYear ? parseInt(establishedYear) : 2002,
    }
  })

  return NextResponse.json(response);
}
