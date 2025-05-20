import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("tk");

  if (!token) {
    return Response.json({ message: "Token is missing." }, { status: 400 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret);

    return Response.json({ message: "Token is valid" }, { status: 200 });

  } catch (error) {
    console.error("JWT verification failed:", error); // Log the specific error

    if (error instanceof jwt.TokenExpiredError) {
      return Response.json({ message: "Token has expired." }, { status: 400 });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return Response.json({ message: "Invalid token." }, { status: 400 });
    } else {
      return Response.json({ message: "An error occurred during token verification." }, { status: 500 });
    }
  }
}