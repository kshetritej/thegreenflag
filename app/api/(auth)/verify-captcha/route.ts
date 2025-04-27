import { NextRequest } from "next/server";

export function POST(req: NextRequest) {
  const body = req.json()
  console.log(body)
}