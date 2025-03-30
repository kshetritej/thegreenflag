import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest, res: NextResponse) {
  return NextResponse.json({ message: "Server is working fine!" });
}