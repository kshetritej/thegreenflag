import { z } from "zod"

export const AddBusinessFormSchema = z.object({
  // Basic Info
  name: z.string().min(2, { message: "Business name must be at least 2 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  subcategory: z.string().optional(),
  address: z.string().min(5, { message: "Please enter a valid address" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().optional(),
  country: z.string().min(2, { message: "Country is required" }),
  postalCode: z.string().optional(),

  // Description
  description: z.string().min(50, { message: "Description must be at least 50 characters" }),
  yearEstablished: z.string().optional(),

  // Amenities
  amenities: z.array(z.string()).optional(),

  // Contact Info
  phone: z.string().min(5, { message: "Phone number is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  website: z.string().url({ message: "Please enter a valid URL" }).optional(),
  hours: z.string().optional(),

  // Owner Info
  ownerName: z.string().min(2, { message: "Owner name is required" }),
  ownerBio: z.string().optional(),
  languages: z.array(z.string()).optional(),

  // Images - in a real app, you'd handle file uploads differently
  mainImage: z.string().optional(),
  additionalImages: z.array(z.string()).optional(),
})