import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient"
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const body = await req.json()
  const user = await prisma.user.findUnique({ where: { email: body.email } })
  if (!user) throw new Error("Invalid credentials");

  const isPasswordValid = await bcrypt.compare(body.password, user.password)
  if (!isPasswordValid) throw new Error("Invalid Credentials");

  return NextResponse.json({ message: "User logged in successfully!" })
}