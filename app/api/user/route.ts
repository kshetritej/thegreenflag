import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const name = searchParams.get("name") || ""
  const page = Number(searchParams.get("page") || 1)
  const limit = Number(searchParams.get("limit") || 10)

  const skip = (page - 1) * limit;
  const take = limit;

  console.log("searchparams", searchParams)

  const [users, totalUsers] = await prisma.$transaction([
    prisma.user.findMany({
      where: {name: {contains: name, mode: "insensitive"}},
      skip,
      take
    }),
    prisma.user.count({
      where: {name: {contains:name, mode:"insensitive"}},
    }),
  ])

  return NextResponse.json({ data: users, pagination: { page, limit, totalPage: Math.floor(totalUsers / limit) } }, { status: 200 });
}