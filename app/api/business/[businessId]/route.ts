import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";

type Params = Promise<{ businessId: string }>
export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  try {
    const businessId = (await params).businessId;

    await prisma.review.deleteMany({
      where: {
        businessId: businessId,
      },
    });

    await prisma.business.delete({
      where: {
        id: businessId,
      },
    });

    return NextResponse.json({ message: "Business and related reviews deleted successfully" });
  } catch (error) {
    console.error("Error deleting business:", error);
    return NextResponse.json(
      { error: "Failed to delete business" },
      { status: 500 }
    );
  }
}

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const business = await prisma.business.findUnique({
    where: {
      id: (await params).businessId
    },
    include: {
      reviews: {
        include: {
          replies: {
            include: {
              author: true
            }
          }
        }
      }
    }
  })

  if (!business) return NextResponse.json({ message: "No business found for specified id.", data: [] }, { status: 204 });

  return NextResponse.json({ data: business }, { status: 200 });
}
