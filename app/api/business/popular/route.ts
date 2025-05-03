import prisma from "@/prisma/prismaClient";
import { NextResponse } from "next/server";

export async function GET() {
  const businesses = await prisma.business.findMany({
    where: {
      reviews: {
        some: {
          rating: {
            gte: 4
          }
        }
      },
    },
    include: {
      reviews: true
    },
    take: 8,
    orderBy: {
      createdAt: "desc"
    }
  })

  return NextResponse.json(businesses);
}