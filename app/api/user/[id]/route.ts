import prisma from "@/prisma/prismaClient"
import {  NextResponse } from "next/server";

export async function GET({ params }: { params: string }) {
  const id = params;
  const user = await prisma.user.findUnique({
    where: {
      id: id
    }
  })
  return NextResponse.json(user, { status: 200 })
}