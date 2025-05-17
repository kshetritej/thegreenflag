import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    console.log("Body", username)
    // Find admin user
    const admin = await prisma.admin.findFirst({
      where: {
        username,
      }
    });

    console.log("admin found", admin)

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = sign(
      {
        id: admin.id,
        username: admin.username,
        role: "ADMIN"
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    // Set HTTP-only cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: admin.id,
          username: admin.username,
          name: admin.name,
          role: "ADMIN",
        }
      },
      { status: 200 }
    );

    response.cookies.set({
      name: "admin-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 // 1 day
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 