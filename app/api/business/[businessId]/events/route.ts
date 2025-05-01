import prisma from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ businessId: string }>

export async function GET(_request: NextRequest, { params }: { params: Params }) {
  const { businessId } = await params;
  const events = await prisma.event.findMany({
    where: {
      businessId: businessId,
    },
  });
  return NextResponse.json(events);
}
