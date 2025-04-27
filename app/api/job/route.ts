import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const businessId = searchParams.get('businessId');
  const featured = searchParams.get('featured') === 'true';
  
  const jobs = await prisma.job.findMany({
    where: {
      ...(businessId ? { businessId } : {}),
      ...(featured ? { featured: true } : {})
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      business: {
        select: {
          name: true,
          mainImage: true,
          city: true,
          state: true
        }
      }
    }
  });
  
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  
  try {
    const job = await prisma.job.create({
      data: body
    });
    
    return NextResponse.json({ message: "Job created successfully", job }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
