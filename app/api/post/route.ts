import { NextRequest, NextResponse } from "next/server"
import prisma from "@/prisma/prismaClient"

export async function POST(request: NextRequest) {
  const body = await request.json()

  const { title, content, authorId } = body

  console.log("Body data", body)

  if (!title || !content || !authorId) {
    throw new Error("Field missing!")
  }

  const post = await prisma.post.create({
    data: {
      ...body
    }
  })

  return NextResponse.json({ message: "Created Successfully", post }, { status: 201 })
}

export async function GET() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
  return NextResponse.json(posts)
}
