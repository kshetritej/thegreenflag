"use client"

import React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { formatDistanceToNow, format } from "date-fns"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Mail, 
  Phone, 
  Trash2,
  PenSquare,
  ArrowLeft
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface JobDetailProps {
  jobId: string
  isOwner?: boolean
}

export default function JobDetail({ jobId, isOwner = false }: JobDetailProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const { data: job, isLoading, error } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      const response = await axios.get(`/api/job/${jobId}`)
      return response.data
    }
  })
  
  const deleteJobMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/job/${jobId}`)
    },
    onSuccess: () => {
      toast.success("Job deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      router.push("/dashboard/jobs")
    },
    onError: () => {
      toast.error("Failed to delete job")
    }
  })
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-40">
        <p>Loading job details...</p>
      </div>
    )
  }
  
  if (error || !job) {
    return (
      <div className="flex justify-center items-center min-h-40">
        <p className="text-destructive">Error loading job details. Please try again.</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        {isOwner && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(`/dashboard/jobs/edit/${jobId}`)}
            >
              <PenSquare className="mr-2 h-4 w-4" />
              Edit
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the job posting.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => deleteJobMutation.mutate()}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      
      <Card className={`overflow-hidden ${job.featured ? 'border-primary/50' : ''}`}>
        {job.featured && (
          <div className="bg-primary text-primary-foreground text-sm font-medium py-1 px-4 text-center">
            Featured Job
          </div>
        )}
        
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
              
              <div className="flex items-center gap-2">
                <Link href={`/business/${job.businessId}`} className="flex items-center gap-2 hover:underline">
                  {job.business.mainImage && (
                    <div className="h-8 w-8 rounded-md overflow-hidden border">
                      <Image 
                        src={job.business.mainImage} 
                        alt={job.business.name} 
                        width={32} 
                        height={32} 
                        className="object-cover h-full w-full"
                      />
                    </div>
                  )}
                  <span className="font-medium">{job.business.name}</span>
                </Link>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.location}
                </Badge>
                
                <Badge variant="outline" className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {job.jobType}
                </Badge>
                
                <Badge variant="outline" className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  {job.salaryRange}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
              </div>
              <div className="text-muted-foreground">
                {format(new Date(job.createdAt), 'MMMM d, yyyy')}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Job Description</h3>
            <div className="whitespace-pre-line">{job.description}</div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-md border">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div>{job.email}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-md border">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div>{job.phone}</div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">About the Company</h3>
            
            <div className="flex items-center gap-3">
              <Link href={`/business/${job.businessId}`} className="flex items-center gap-3 hover:underline">
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
                <div>
                  <div className="font-medium">{job.business.name} <Badge>{job.business.category}</Badge></div>
                  <div className="text-sm text-muted-foreground">
                    {job.business.city}, {job.business.state}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
