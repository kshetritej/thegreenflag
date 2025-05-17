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

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const businessId = (await params).businessId;
    const data = await req.json();

    const updatedBusiness = await prisma.business.update({
      where: {
        id: businessId,
      },
      data: {
        name: data.name,
        category: data.category,
        subcategory: data.subcategory,
        street: data.street,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
        description: data.description,
        establishedYear: data.establishedYear ? parseInt(data.establishedYear) : undefined,
        amenities: data.amenities,
        phone: data.phone,
        email: data.email,
        website: data.website,
        hours: data.hours,
        googleMapsUrl: data.googleMapsUrl,
        logo: data.logo,
        tags: data.tags,
      },
    });

    return NextResponse.json({
      message: "Business updated successfully",
      data: updatedBusiness
    });
  } catch (error) {
    console.error("Error updating business:", error);
    return NextResponse.json(
      { error: "Failed to update business" },
      { status: 500 }
    );
  }
}


