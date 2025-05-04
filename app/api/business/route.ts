import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Category, Job } from "@prisma/client";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const categoriesParam = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  const businesses = await prisma.business.findMany({
    where: {
      AND: [
        {
          category: categoriesParam ? categoriesParam as Category : undefined,
        },
        {
          name: {
            contains: searchQuery ? searchQuery : undefined,
            mode: "insensitive"
          }
        }
      ],
      OR:[
        {category: }
      ]
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      jobs: true,
      reviews: {
        include: {
          author: true
        }
      }
    }
  });
  return NextResponse.json(businesses);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { establishedYear, mainImage, additionalImages, ...data } = body;

  const response = await prisma.business.create({
    data: {
      ...data,
      images: additionalImages,
      establishedYear: establishedYear ? parseInt(establishedYear) : 2002,
    }
  })

  return NextResponse.json(response);
}