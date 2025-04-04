import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";

export async function DELETE(
  { params }: { params: { businessId: string } }
) {
  try {
    const businessId = params.businessId;

    // First, delete all reviews associated with the business
    await prisma.review.deleteMany({
      where: {
        businessId: businessId,
      },
    });

    // Then, delete the business itself
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

export async function GET({ params }: { params: { businessId: string } }) {
  const business = await prisma.business.findUnique({
    where: {
      id: params.businessId
    }
  })

  if (!business) return NextResponse.json({ message: "No business found for specified id.", data: [] }, { status: 204 });

  return NextResponse.json({ data: business }, { status: 200 });
}