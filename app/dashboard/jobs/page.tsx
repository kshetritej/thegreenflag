import React from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import prisma from "@/prisma/prismaClient"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import JobListClient from "@/components/job/job-list-client"

export default async function JobsPage() {
  const session = await getServerSession()

  if (!session?.user?.email) {
    redirect("/api/auth/signin")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      businesses: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  if (!user) {
    redirect("/api/auth/signin")
  }

  const businessIds = user.businesses.map(business => business.id)

  const jobs = await prisma.job.findMany({
    where: {
      businessId: {
        in: businessIds
      }
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
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Jobs</h1>

        {user.businesses.length > 0 && (
          <Link href="/dashboard/jobs/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Post New Job
            </Button>
          </Link>
        )}
      </div>

      {user.businesses.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Businesses Found</CardTitle>
            <CardDescription>
              You need to create a business before you can post jobs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/business">
              <Button>Create a Business</Button>
            </Link>
          </CardContent>
        </Card>
      ) : jobs.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Jobs Posted</CardTitle>
            <CardDescription>
              You haven't posted any jobs yet. Create your first job posting.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/jobs/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Post New Job
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <JobListClient initialJobs={jobs} isOwner={true} />
      )}
    </div>
  )
}
