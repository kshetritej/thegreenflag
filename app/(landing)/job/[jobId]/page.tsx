import React from "react"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import prisma from "@/prisma/prismaClient"
import JobDetail from "@/components/job/job-detail"

export default async function JobDetailPage({ params }: { params: { jobId: string } }) {
  const session = await getServerSession()
  
  // Get the job
  const job = await prisma.job.findUnique({
    where: {
      id: params.jobId
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
  
  // Check if the current user owns the business that posted this job
  const isOwner = session?.user?.email === job.business.owner.email
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <JobDetail jobId={job.id} isOwner={isOwner} />
    </div>
  )
}
