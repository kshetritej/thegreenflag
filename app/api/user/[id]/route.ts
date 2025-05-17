import prisma from "@/prisma/prismaClient"
import {  NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth"

type Params = Promise<{id: string}>
export async function GET(_req: NextRequest, { params }: { params: Params}) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: (await params).id
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        profileImage: true,
        bio: true,
        phone: true,
        address: true,
        languages: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ data: user })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest, { params }: { params:  Params }) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Verify that the user is updating their own profile
    const user = await prisma.user.findUnique({
      where: {
        id: (await params).id,
        email: session.user.email
      }
    })

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: (await params).id,
      },
      data: {
        name: data.name,
        username: data.username,
        phone: data.phone,
        address: data.address,
        bio: data.bio,
        languages: data.isEnglishSpeaking ? ["English"] : [""],
        profileImage: data.profileImage,
      },
    })

    return NextResponse.json({
      message: "Profile updated successfully",
      data: updatedUser
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}