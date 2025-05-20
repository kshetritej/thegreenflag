import prisma from "@/prisma/prismaClient";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(_req: NextRequest) {
  const body = await _req.json()
  const { email } = body
  const emailExists = await prisma.user.findUnique({
    where: { email: email }
  })

  if (!emailExists) throw new Error("Email not found");

  const token = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: "5m" })
  console.log("token:", token)

  const link = process.env.NODE_ENV !== "development" ? `http://greenflag.kshetritej.com.np/api/forget-password/${token}` : `http://localhost:3000/api/forget-password/${token}`
  const message = `
  <div>
  <h1>Click the link below to reset your password</h1>
  <button>
    <a href="${link}">Reset Password</a>
  </button>
  <p>This link will expire in 5 minutes.</p>
  <p>If you did not request this email, please ignore it.</p>
  </div>
  `
  const subject = "Reset Password"
  const to = email
  const from = "The GreenFlagPlatform <noreply@kshetritej.com.np>"


  try {
    const { data, error } = await resend.emails.send({
      from: from,
      to: to,
      subject: subject,
      react: message,
    });
    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }

}