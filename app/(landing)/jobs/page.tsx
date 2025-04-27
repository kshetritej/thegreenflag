import React from "react"
import JobList from "@/components/job/job-list"
import prisma from "@/prisma/prismaClient"

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      business: {
        select: {
          name: true,
          mainImage: true,
          city: true,
          state: true
        }
      }
    }
  })
 
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-4">Find Your Next Opportunity</h1>
        <p className="text-muted-foreground text-lg">
          Browse through our curated list of job opportunities from top businesses
        </p>
      </div>
      
      <JobList />
    </div>
  )
}
