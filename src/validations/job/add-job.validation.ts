import { z } from "zod"

export const JobFormSchema = z.object({
  title: z.string().min(5, { message: "Job title must be at least 5 characters" }),
  description: z.string().min(50, { message: "Job description must be at least 50 characters" }),
  location: z.string().min(3, { message: "Location is required" }),
  jobType: z.string().min(3, { message: "Job type is required" }),
  salaryRange: z.string().min(3, { message: "Salary range is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(5, { message: "Phone number is required" }),
  businessId: z.string().uuid({ message: "Business ID is required" }),
  featured: z.boolean().default(false),
})

export type JobFormValues = z.infer<typeof JobFormSchema>
