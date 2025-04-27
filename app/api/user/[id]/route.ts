import prisma from "@/prisma/prismaClient"
import {  NextResponse } from "next/server";

type Params = Promise<string>
export async function GET({ params }: { params: Params}) {
  const id = await params;
  const user = await prisma.user.findUnique({
    where: {
      id: id
    }
  })
  return NextResponse.json(user, { status: 200 })
}