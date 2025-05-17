import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

export function middleware(request: NextRequest) {
  // Check if the request is for the admin dashboard
  if (request.nextUrl.pathname.startsWith("/flag-admin")) {
    const token = request.cookies.get("admin-token");
    console.log("Token: ", token)

    if (!token) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }

    console.log("Trying...")
    try {
      // Verify the token and check if it's an admin
      console.log("trying to decode")
      console.log("secret jwt:", process.env.JWT_SECRET)
      // const decoded = verify(token.value, process.env.JWT_SECRET as string) as { role?: string };

      // console.log("Decoded", decoded)
      // if (!decoded || decoded.role !== "ADMIN") {
      //   // Clear invalid token
      //   const response = NextResponse.redirect(new URL("/admin-login", request.url));
      //   response.cookies.delete("admin-token");
      //   return response;
      // }

      return NextResponse.next();
    } catch (error) {
      // If token is invalid, clear it and redirect to login
      const response = NextResponse.redirect(new URL("/admin-login", request.url));
      response.cookies.delete("admin-token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/flag-admin/:path*",
}; 