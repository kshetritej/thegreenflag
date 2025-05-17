import { JobCard } from "@/components/job/job-list-client";
import prisma from "@/prisma/prismaClient"

type Params = Promise<{id: string}>
export default async function JobsById({ params }: { params: Params }) {
  const businessId = (await params).id;
  const jobs = await prisma.job.findMany({
    where: {
      businessId
    },
    include: {
      business: {
        select: {
          name: true,
          city: true,
          state: true,
          images:true,
        }
      },
    }
  })

  return (
    <div className="container mx-auto py-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Job Openings</h1>
          <p className="text-muted-foreground mt-2">Find your next opportunity at local businesses</p>
        </div>
      {
        jobs.length === 0 ?
          <p className="text-center">No jobs found.</p>
          :
          jobs.map((job, index) => {
            return (
              // @ts-expect-error may not be incompatible but it works
              <JobCard key={index} job={job} isOwner={false} />
            )
          })
      }
    </div>
  )
}