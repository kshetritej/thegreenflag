import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/prisma/prismaClient";
import jwt, { Secret as JwtSecret } from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const userExist = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (userExist) {
      return NextResponse.json({ message: "User already exists" }, {status: 400 });
    }

    const hashedPassword = bcrypt.hashSync(body.password, 10);
    const isEnglishSpeaking = body.isEnglishSpeaking ? ["English"] : [];

    const { isEnglishSpeaking: removed, ...restOfBody } = body;
    
    const newUser = await prisma.user.create({
      data: {
        ...restOfBody,
        languages: isEnglishSpeaking,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ email: newUser.email, id: newUser.id }, process.env.JWT_SECRET as JwtSecret, {
      expiresIn: "10m",
    });

    return NextResponse.json(
      { message: "User registered successfully", data: newUser, token },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
