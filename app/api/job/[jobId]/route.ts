import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";

type Params = Promise<{ jobId: string }>

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  try {
    const job = await prisma.job.findUnique({
      where: {
        id: (await params).jobId
      },
      include: {
        business: {
          select: {
            name: true,
            logo: true,
            category: true,
            city: true,
            state: true
          }
        }
      }
    });

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const body = await req.json();

    const job = await prisma.job.update({
      where: {
        id: (await params).jobId
      },
      data: body
    });

    return NextResponse.json({ message: "Job updated successfully", job });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  try {

    await prisma.job.delete({
      where: {
        id: (await params).jobId
      }
    });

    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
