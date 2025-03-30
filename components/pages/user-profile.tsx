import prisma from "@/prisma/prismaClient"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import Navbar from "../common/navbar"

export default async function UserProfile() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email
    }
  })

  return (
    <div>
      <h1>User Profile</h1>
      {JSON.stringify(user)}
    </div>
  )
}