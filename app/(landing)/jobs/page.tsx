"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Building2, Clock, DollarSign, MapPin, Sparkles } from "lucide-react"
import Link from "next/link"

// Mock data
const jobs = [
  {
    id: 1,
    title: "Senior Chef",
    business: "Himalayan Cafe",
    location: "Portland, OR",
    type: "Full-time",
    salary: "$65,000 - $85,000",
    posted: "2 days ago",
    description: "We're looking for an experienced chef who specializes in Nepalese and Indian cuisine. Must have 5+ years of experience in similar cuisine.",
    requirements: ["5+ years experience", "Knowledge of South Asian cuisine", "Team management", "Food safety certification"],
    featured: true,
    category: "Restaurant",
    contact: {
      email: "jobs@himalayancafe.com",
      phone: "(503) 555-0123"
    }
  },
  {
    id: 2,
    title: "Barista",
    business: "Mountain Coffee Co.",
    location: "Seattle, WA",
    type: "Part-time",
    salary: "$18 - $22/hr",
    posted: "1 day ago",
    description: "Join our passionate team of coffee enthusiasts. Morning and evening shifts available.",
    requirements: ["1+ year barista experience", "Customer service skills", "Weekend availability"],
    featured: false,
    category: "Cafe",
    contact: {
      email: "hire@mountaincoffee.com",
      phone: "(206) 555-0123"
    }
  },
  // Add more mock jobs as needed
]

export default function JobsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Job Openings</h1>
          <p className="text-muted-foreground mt-2">Find your next opportunity at local businesses</p>
        </div>
        <Link href="/dashboard/jobs/post">
          <Button>
            <Briefcase className="mr-2 h-4 w-4" />
            Post a Job
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className={`${job.featured ? 'border-primary' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {job.title}
                    {job.featured && (
                      <Badge variant="default" className="bg-primary">
                        <Sparkles className="mr-1 h-3 w-3" />
                        Featured
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span className="flex items-center">
                      <Building2 className="mr-1 h-4 w-4" />
                      {job.business}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {job.type}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="mr-1 h-4 w-4" />
                      {job.salary}
                    </span>
                  </CardDescription>
                </div>
                <Badge variant="outline">{job.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{job.description}</p>
              <div className="space-y-2">
                <h4 className="font-semibold">Requirements:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="text-muted-foreground">{req}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Posted {job.posted}
              </div>
              <div className="space-x-2">
                <Button variant="outline" asChild>
                  <Link href={`mailto:${job.contact.email}`}>
                    Email
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`tel:${job.contact.phone}`}>
                    Call Now
                  </Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
