import prisma from "@/prisma/prismaClient";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email: email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}