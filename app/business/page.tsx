import Navbar from "@/components/common/navbar"
import AddBusinessForm from "@/components/pages/add-business-form"
import prisma from "@/prisma/prismaClient"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function AddBusinessPage() {
  const session = await getServerSession()

  if(!session?.user?.email) {
    redirect("/api/auth/signin")
  }

  const user = await prisma.user.findUnique({
    where: {email: session.user.email}
  })

  return (
    <>
    {
      user && <AddBusinessForm user={user} />
    }
    </>
  )
}

