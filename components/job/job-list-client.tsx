"use client"

import React, { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

// UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Search, 
  Building2,
  PenSquare,
  Eye
} from "lucide-react"

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
  createdAt: string | Date
  updatedAt: string | Date
  business: {
    name: string
    logo: string
    city: string
    state: string
  }
}

interface JobListClientProps {
  initialJobs: Job[]
  isOwner?: boolean
}

export default function JobListClient({ initialJobs, isOwner = false }: JobListClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.business.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFeatured = featuredOnly ? job.featured : true
    
    return matchesSearch && matchesFeatured
  })
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              className="pl-9 max-w-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {filteredJobs.length === 0 ? (
        <div className="text-center py-10">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">No jobs found</h3>
          <p className="mt-2 text-muted-foreground">
            No jobs match your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} isOwner={isOwner} />
          ))}
        </div>
      )}
    </div>
  )
}

export function JobCard({ job, isOwner }: { job: Job, isOwner: boolean }) {
  const router = useRouter()
  
  return (
    <Card className={`overflow-hidden ${job.featured ? 'border-primary/50 bg-primary/5' : ''}`}>
      {job.featured && (
        <div className="bg-primary text-primary-foreground text-xs font-medium py-1 px-3 text-center">
          Featured Job
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
          
          {job.business.logo && (
            <div className="h-12 w-12 rounded-md overflow-hidden border">
              <Image 
                src={job.business.logo} 
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
        
        <div className="flex gap-2">
          {isOwner && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(`/dashboard/jobs/edit/${job.id}`)}
            >
              <PenSquare className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
          
          <Button 
            size="sm"
            onClick={() => router.push(`/job/${job.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
