import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";

type Params = Promise<{ postId: string }>
export async function GET(_request: NextRequest, { params }: { params: Params }) {
  const { postId } = await params
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
      },
    },
  })
  return NextResponse.json(post)
}


export async function POST(request: NextRequest, { params }: { params: Params }) {
  const body = await request.json()
  const { content, authorId } = body
  const { postId } = await params
  const post = await prisma.post.findUnique({
    where: { id: postId },
  })

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  const comment = await prisma.comment.create({
    data: { content, postId: post.id, authorId: authorId },
  })

  return NextResponse.json(comment)
}
