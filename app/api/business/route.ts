import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest){
  return NextResponse.json({message: "Hello, Bs!"})
}

export async function POST(req: NextRequest){
  const body = await req.json();
  console.log(body);
}
