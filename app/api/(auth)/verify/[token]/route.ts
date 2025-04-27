import prisma from "@/prisma/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import jwt, { Secret } from "jsonwebtoken";
import { headers } from "next/headers";

type Params = Promise<{ token: string }>

export async function GET(_req: NextRequest, { params }: { params: Params }) {

  const token = (await params).token;
  if (!token) {
    return NextResponse.json({ message: "Invalid token or token expired." }, { status: 400 })
  }

  const tokenUser = jwt.verify(token, process.env.JWT_SECRET as Secret) as { email: string }
  const user = await prisma.user.findUnique({
    where: {
      email: tokenUser.email
    }
  })

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  await prisma.user.update({
    where: {
      email: tokenUser.email
    },
    data: {
      verified: true
    }
  })

  return new NextResponse(`
    <div>
    <h1>Your email has been verified successfully!</h1>
    <button>
      <a href="http://localhost:3000/">Go to homepage.</a>
    </button>
    </div>
    `, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  });
}