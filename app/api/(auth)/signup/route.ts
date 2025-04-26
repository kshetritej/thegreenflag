import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/prisma/prismaClient"

export async function POST(req: NextRequest) {
  const body = await req.json();
  const hashedPassword = bcrypt.hashSync(body.password, 10); 
  const isEnglishSpeaking = body.isEnglishSpeaking ? ["English"] : []

  const { isEnglishSpeaking: removed, ...restOfBody } = body;
  console.log('removed', removed)
  const newUser = await prisma.user.create({
    data: {
      ...restOfBody,
      languages: isEnglishSpeaking,
      password: hashedPassword
    }
  })

  return NextResponse.json({ message: "User registered successfully", data: newUser }, { status: 201 })
}