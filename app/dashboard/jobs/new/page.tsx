import React from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import AddJobForm from "@/components/job/add-job-form"

export default async function NewJobPage() {
  const session = await getServerSession()

  if (!session?.user?.email) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Post a New Job</h1>
      <AddJobForm />
    </div>
  )
}
