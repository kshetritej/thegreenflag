import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Category } from "@prisma/client";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const categoriesParam = searchParams.get('category')

  const businesses = await prisma.business.findMany({
    where: {
      category: categoriesParam ? categoriesParam as Category : undefined
    }
  });
  return NextResponse.json(businesses);
}

export async function POST(req: NextRequest){
  const body = await req.json();
  const { establishedYear, mainImage, additionalImages, ...data } = body;

  const response = await prisma.business.create({
    data: {
      ...data,
      mainImage: mainImage,
      images: additionalImages,
      establishedYear: establishedYear ? parseInt(establishedYear) : 2002,
    }
  })

  return NextResponse.json(response);
}