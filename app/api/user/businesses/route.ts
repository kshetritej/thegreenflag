import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/prisma/prismaClient"

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized", data: [] }, { status: 401 })
  }
  
  try {
    const businesses = await prisma.business.findMany({
      where: {
        owner: {
          email: session.user.email
        }
      },
      select: {
        id: true,
        name: true
      }
    })
    
    return NextResponse.json({ data: businesses })
  } catch (error) {
    console.error("Error fetching user businesses:", error)
    return NextResponse.json({ message: "Error fetching businesses", data: [] }, { status: 500 })
  }
}
