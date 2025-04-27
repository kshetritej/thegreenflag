import prisma from "@/prisma/prismaClient"
import { NextRequest, NextResponse } from "next/server"

type Params = Promise<{id: string}>

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const ownerId = (await params).id;
  const businesses = await prisma.business.findMany({
    where: {
      owner: { id: ownerId},
    },
  })
  return NextResponse.json({ data: businesses })
}
