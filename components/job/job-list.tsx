"use client"

import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import Image from "next/image"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LucideSparkles, Briefcase, MapPin, DollarSign, Calendar, Search, Building2 } from "lucide-react"

interface Job {
  id: string
  title: string
  description: string
  location: string
  jobType: string
  salaryRange: string
  email: string
  phone: string
  businessId: string
  featured: boolean
  createdAt: string
  updatedAt: string
  business: {
    name: string
    mainImage: string
    city: string
    state: string
  }
}

interface JobListProps {
  businessId?: string
  showFilters?: boolean
  limit?: number
}

export default function JobList({ businessId, showFilters = true, limit }: JobListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ["jobs", businessId],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (businessId) params.append("businessId", businessId)

      const response = await axios.get(`/api/job?${params.toString()}`)
      return response.data as Job[]
    }
  })

  const filteredJobs = jobs?.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.business.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const displayJobs = limit ? filteredJobs?.slice(0, limit) : filteredJobs

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-40">
        <p>Loading jobs...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-40">
        <p className="text-destructive">Error loading jobs. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                className="pl-9 w-full py-3 rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {displayJobs?.length === 0 ? (
        <div className="text-center py-10">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">No jobs found</h3>
          <p className="mt-2 text-muted-foreground">
            {businessId
              ? "This business hasn't posted any jobs yet."
              : "No jobs match your search criteria."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {displayJobs?.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}

function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/job/${job.id}`}>
      <Card className={`overflow-hidden ${job.featured ? 'border-primary/50 bg-primary/5' : ''}`}>
        {job.featured && (
          <div className="p-2">
            <Badge className="p-2 mr-4"><LucideSparkles />Featured</Badge>
          </div>
        )}

        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {job.business.name}
              </CardDescription>
            </div>

            {job.business.mainImage && (
              <div className="h-12 w-12 rounded-md overflow-hidden border">
                <Image
                  src={job.business.mainImage}
                  alt={job.business.name}
                  width={48}
                  height={48}
                  className="object-cover h-full w-full"
                />
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="space-y-4">
            <p className="text-sm line-clamp-2">{job.description}</p>

            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </Badge>

              <Badge variant="outline" className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {job.jobType}
              </Badge>

              <Badge variant="outline" className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {job.salaryRange}
              </Badge>

              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center pt-0">
          <div className="text-sm text-muted-foreground">
            {job.business.city}, {job.business.state}
          </div>

          <Link href={`/job/${job.id}`}>
            <Button size="sm">View Details</Button>
          </Link>
        </CardFooter>
      </Card>

    </Link>
  )
}
