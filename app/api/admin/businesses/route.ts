import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const where: Prisma.BusinessWhereInput = search
      ? {
        OR: [
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { owner: { email: { contains: search, mode: Prisma.QueryMode.insensitive } } },
        ],
      }
      : {};

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        include: {
          owner: {
            select: {
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.business.count({ where }),
    ]);

    const formattedBusinesses = businesses.map((business) => ({
      id: business.id,
      name: business.name,
      owner: business.owner.email,
      status: business.verified,
      suspended: business.suspended,
      createdAt: business.createdAt.toISOString().split("T")[0],
    }));

    return NextResponse.json({
      businesses: formattedBusinesses,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("[BUSINESSES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 