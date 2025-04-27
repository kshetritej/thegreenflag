import React from "react"
import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import prisma from "@/prisma/prismaClient"
import AddJobForm from "@/components/job/add-job-form"

type Params = Promise<{businessId: string}>
export default async function NewJobForBusinessPage({ params }: { params: Params }) {
  const session = await getServerSession()
  
  if (!session?.user?.email) {
    redirect("/api/auth/signin")
  }
  
  const business = await prisma.business.findFirst({
    where: {
      id: (await params).businessId,
      owner: {
        email: session.user.email
      }
    }
  })
  
  if (!business) {
    notFound()
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Post a New Job</h1>
      <AddJobForm businessId={business.id} businessName={business.name} />
    </div>
  )
}
