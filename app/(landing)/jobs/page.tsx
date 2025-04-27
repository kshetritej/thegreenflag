import React from "react"
import JobList from "@/components/job/job-list"
import prisma from "@/prisma/prismaClient"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"
import { getServerSession } from "next-auth"

export default async function JobsPage() {
  const user = await getServerSession()
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Job Openings</h1>
          <p className="text-muted-foreground mt-2">Find your next opportunity at local businesses</p>
        </div>
        {
          user?.user && (
            <Link href="/dashboard/jobs">
              <Button>
                <Briefcase className="mr-2 h-4 w-4" />
                Manage Jobs
              </Button>
            </Link>
          )
        }
      </div>
      
      <JobList />
    </div>
  )
}
