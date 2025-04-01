import prisma from "@/prisma/prismaClient"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { content, rating, authorId, businessId } = body

  const review = await prisma.review.create({
    data: {
      content,
      rating,
      author: {
        connect: {
          id: body.authorId,
        },
      },
      business: {
        connect: {
          id: body.businessId,
        },
      },
    },
  })

  return NextResponse.json({ message: "Review created successfully", review })
}