"use client"

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { JobFormSchema, JobFormValues } from "@/src/validations/job/add-job.validation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Building2, MapPin, Mail, Phone, DollarSign, Check } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Business {
  id: string
  name: string
}

export default function AddJobForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Fetch user's businesses
  const { data: businesses, isLoading: isLoadingBusinesses } = useQuery({
    queryKey: ["userBusinesses"],
    queryFn: async () => {
      if (!session?.user?.email) return []
      const response = await axios.get(`/api/user/businesses`)
      return response.data.data as Business[]
    },
    enabled: !!session?.user?.email
  })

  const form = useForm<JobFormValues>({
    resolver: zodResolver(JobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      jobType: "",
      salaryRange: "",
      email: "",
      phone: "",
      businessId: "",
      featured: false
    }
  })

  // Set default email if user is logged in
  useEffect(() => {
    if (session?.user?.email) {
      form.setValue("email", session.user.email)
    }
  }, [session, form])

  const createJobMutation = useMutation({
    mutationFn: (data: JobFormValues) => axios.post("/api/job", data),
    onSuccess: () => {
      setSuccessMessage("Job posted successfully!")
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      form.reset({
        title: "",
        description: "",
        location: "",
        jobType: "",
        salaryRange: "",
        email: session?.user?.email || "",
        phone: "",
        businessId: "",
        featured: false
      })

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    },
    onError: () => {
      toast.error("Failed to post job")
    }
  })

  const onSubmit = (data: JobFormValues) => {
    createJobMutation.mutate(data)
  }

  // We need to watch businessId to enable/disable the submit button
  form.watch("businessId")

  if (isLoadingBusinesses) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center py-8">
            <p>Loading your businesses...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (businesses?.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Post a New Job</CardTitle>
          <CardDescription>
            You need to create a business before you can post jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <p className="text-muted-foreground">You don't have any businesses yet.</p>
            <Button onClick={() => router.push("/business")}>
              Create a Business
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Post a New Job</CardTitle>
        <CardDescription>
          Create a job posting for your business
        </CardDescription>
      </CardHeader>

      <CardContent>
        {successMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Business Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Select Business</h3>
              </div>

              <FormField
                control={form.control}
                name="businessId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a business" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {businesses?.map((business) => (
                          <SelectItem key={business.id} value={business.id}>
                            {business.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Job Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Senior Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Full-time, Part-time, Contract" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the job responsibilities, requirements, and benefits..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9" placeholder="e.g. New York, NY or Remote" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salaryRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Range</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9" placeholder="e.g. $80,000 - $100,000" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Contact Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9" placeholder="+1 (555) 123-4567" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured Job</FormLabel>
                    <FormDescription>
                      Featured jobs appear at the top of job listings and receive more visibility.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={createJobMutation.isPending || !form.watch("businessId")}
              >
                {createJobMutation.isPending ? "Posting..." : "Post Job"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
