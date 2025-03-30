import { NextResponse } from "next/server"

export function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  console.log(category)
  return NextResponse.json({ message: "Hello, world!" })
}
