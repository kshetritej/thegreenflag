import prisma from "@/prisma/prismaClient"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { content, authorId, reviewId } = await request.json()
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId
    }
  })

  if (!review) {
    throw new Error("Review not found")
  }

  const addedReply = await prisma.reply.create({
    data: {
      content: content,
      reviewId: reviewId,
      authorId: authorId
    }
  })

  await prisma.review.update({
    where: {
      id: reviewId
    },
    data: {
      replies: { connect: { id: addedReply.id } }
    }
  })
  return NextResponse.json(addedReply, { status: 200 })
}