import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/prisma/prismaClient"

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url))
  }
  
  const formData = await request.formData()
  const businessId = formData.get("businessId") as string
  
  if (!businessId) {
    return NextResponse.redirect(new URL("/dashboard/jobs/new", request.url))
  }
  
  // Verify that the user owns this business
  const business = await prisma.business.findFirst({
    where: {
      id: businessId,
      owner: {
        email: session.user.email
      }
    }
  })
  
  if (!business) {
    return NextResponse.redirect(new URL("/dashboard/jobs", request.url))
  }
  
  return NextResponse.redirect(new URL(`/dashboard/jobs/new/${businessId}`, request.url))
}
