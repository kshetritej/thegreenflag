import { NextRequest } from "next/server"
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export async function GET(_req: NextRequest) {
  const token = _req.nextUrl.pathname.split("/").pop()

  if (!token) {
    return Response.json({ message: "Invalid token or token expired." }, { status: 400 })
  }

  const tokenIsValid = jwt.verify(token as string, process.env.JWT_SECRET as string)

  if (tokenIsValid instanceof jwt.TokenExpiredError) {
    return Response.json({ message: "Invalid token or token expired." }, { status: 400 })
  }

  if (!tokenIsValid) {
    return Response.json({ message: "Invalid token or token expired." }, { status: 400 })
  }

  const decoded = jwt.decode(token as string) as { email: string }
  if (!decoded) {
    return Response.json({ message: "Invalid token or token expired." }, { status: 400 })
  }

  const email = decoded.email

  redirect(`http://localhost:3000/reset-password?email=${email}&token=${token}`)
  return Response.json({ message: "Token is valid" }, { status: 200 })
}