import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY, dangerouslyAllowBrowser: true });
  const { prompt } = await req.json()

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

  const data = response.choices[0].message.content
  console.log(data)
  return NextResponse.json(data)
}