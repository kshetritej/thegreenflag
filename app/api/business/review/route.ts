import prisma from "@/prisma/prismaClient"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { images, content, rating, authorId, businessId } = body

  const review = await prisma.review.create({
    data: {
      content,
      rating,
      images,
      author: {
        connect: {
          id: authorId,
        },
      },
      business: {
        connect: {
          id: businessId,
        },
      },
    },
  })

  return NextResponse.json({ message: "Review created successfully", review })
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const { userId, reviewId } = body;

  const review = await prisma.review.findUnique({where: {id:reviewId}})
  if(!review) return NextResponse.json({message: "Review not found"}, {status: 404})
  if(review.authorId !== userId) return NextResponse.json({message: "You are not authorized to delete this review"}, {status: 403})

  const deletedReview = await prisma.review.delete({
    where: { id: reviewId, authorId: userId },
  })

  return NextResponse.json({ message: "Review deleted successfully", deletedReview })
}