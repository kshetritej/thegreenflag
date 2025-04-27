import React from "react"
import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import prisma from "@/prisma/prismaClient"
import EditJobForm from "@/components/job/edit-job-form"

type Params = Promise<{ jobId: string }>
export default async function EditJobPage({ params }: { params: Params }) {
  const session = await getServerSession()
  const id = (await params).jobId

  if (!session?.user?.email) {
    redirect("/api/auth/signin")
  }

  const job = await prisma.job.findUnique({
    where: {
      id
    },
    include: {
      business: {
        include: {
          owner: {
            select: {
              email: true
            }
          }
        }
      }
    }
  })

  if (!job) {
    notFound()
  }

  if (job.business.owner.email !== session.user.email) {
    redirect("/dashboard/jobs")
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Edit Job</h1>
      <EditJobForm jobId={job.id} />
    </div>
  )
}
