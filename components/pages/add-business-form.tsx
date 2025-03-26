"use client"

import { useState } from "react"
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Building, MapPin, Phone, Upload, ChevronRight, ChevronLeft, Check } from "lucide-react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Define the form schema
const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>

// Define amenities options
const amenitiesOptions = [
  { id: "wifi", label: "Free Wi-Fi" },
  { id: "creditCards", label: "Credit Cards Accepted" },
  { id: "parking", label: "Parking Available" },
  { id: "delivery", label: "Delivery" },
  { id: "takeout", label: "Takeout" },
  { id: "reservations", label: "Reservations" },
  { id: "outdoor", label: "Outdoor Seating" },
  { id: "wheelchair", label: "Wheelchair Accessible" },
  { id: "familyFriendly", label: "Family Friendly" },
  { id: "vegetarian", label: "Vegetarian Options" },
  { id: "vegan", label: "Vegan Options" },
  { id: "glutenFree", label: "Gluten-Free Options" },
]

// Define language options
const languageOptions = [
  { id: "english", label: "English" },
  { id: "spanish", label: "Spanish" },
  { id: "french", label: "French" },
  { id: "german", label: "German" },
  { id: "chinese", label: "Chinese" },
  { id: "japanese", label: "Japanese" },
  { id: "korean", label: "Korean" },
  { id: "arabic", label: "Arabic" },
  { id: "hindi", label: "Hindi" },
  { id: "portuguese", label: "Portuguese" },
  { id: "russian", label: "Russian" },
  { id: "italian", label: "Italian" },
]

export default function AddBusinessForm() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      subcategory: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      description: "",
      yearEstablished: "",
      amenities: [],
      phone: "",
      email: "",
      website: "",
      hours: "",
      ownerName: "",
      ownerBio: "",
      languages: [],
      mainImage: "",
      additionalImages: [],
    },
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true)

    // Simulate API call
    console.log("Form data:", data)

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 200000))

    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const nextStep = async () => {
    let canProceed = false

    if (step === 1) {
      const basicInfoFields = ["name", "category", "address", "city", "country"]
      const result = await form.trigger(basicInfoFields as any)
      canProceed = result
    } else if (step === 2) {
      const descriptionFields = ["description"]
      const result = await form.trigger(descriptionFields as any)
      canProceed = result
    } else if (step === 3) {
      // Amenities are optional, so we can proceed
      canProceed = true
    } else if (step === 4) {
      const contactFields = ["phone", "email"]
      const result = await form.trigger(contactFields as any)
      canProceed = result
    } else if (step === 5) {
      const ownerFields = ["ownerName"]
      const result = await form.trigger(ownerFields as any)
      canProceed = result
    }

    if (canProceed) {
      setStep((prev) => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="mx-auto rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-center text-2xl">Business Added Successfully!</CardTitle>
            <CardDescription className="text-center">
              Your business has been submitted for review. We'll notify you once it's approved.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pt-6">
            <Button onClick={() => (window.location.href = "/")}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">Add Your Business</h1>
      <p className="text-gray-600 mb-8">Complete the form below to add your business to our platform.</p>

      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex flex-col items-center ${stepNumber <= step ? "text-primary" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                  ${stepNumber < step
                    ? "bg-primary text-white"
                    : stepNumber === step
                      ? "border-2 border-primary"
                      : "border-2 border-gray-200"
                  }`}
              >
                {stepNumber < step ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
              <span className="text-xs hidden md:block">
                {stepNumber === 1 && "Basic Info"}
                {stepNumber === 2 && "Description"}
                {stepNumber === 3 && "Amenities"}
                {stepNumber === 4 && "Contact"}
                {stepNumber === 5 && "Owner Info"}
                {stepNumber === 6 && "Images"}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 h-1 mt-4 rounded-full">
          <div
            className="bg-primary h-1 rounded-full transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          ></div>
        </div>
      </div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Building className="h-5 w-5" />
                Basic Information
              </h2>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Himalayan Cafe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="hotel">Hotel</SelectItem>
                          <SelectItem value="retail">Retail Store</SelectItem>
                          <SelectItem value="service">Service Business</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="health">Health & Wellness</SelectItem>
                          <SelectItem value="beauty">Beauty & Spa</SelectItem>
                          <SelectItem value="auto">Automotive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subcategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategory</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Nepalese Cuisine" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <h3 className="text-lg font-medium flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </h3>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 123 Main Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Lalitpur" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bagmati" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Nepal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 44600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Business Description</h2>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your business, what makes it special, and what customers can expect..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum 50 characters. Be detailed and highlight what makes your business unique.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yearEstablished"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Established</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2015" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Amenities & Features</h2>
              <p className="text-gray-600">Select all amenities and features that apply to your business.</p>

              <FormField
                control={form.control}
                name="amenities"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {amenitiesOptions.map((amenity) => (
                        <FormField
                          key={amenity.id}
                          control={form.control}
                          name="amenities"
                          render={({ field }) => {
                            return (
                              <FormItem key={amenity.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(amenity.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), amenity.id])
                                        : field.onChange(field.value?.filter((value) => value !== amenity.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{amenity.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., +977 1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., info@himalayancafe.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., https://himalayancafe.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Hours</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mon-Sat: 10AM-10PM, Sun: Closed" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Owner Information</h2>

              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Raj Pradhan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownerBio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share a bit about yourself, your background, and your passion for this business..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="languages"
                render={() => (
                  <FormItem>
                    <FormLabel>Languages Spoken</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {languageOptions.map((language) => (
                        <FormField
                          key={language.id}
                          control={form.control}
                          name="languages"
                          render={({ field }) => {
                            return (
                              <FormItem key={language.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(language.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), language.id])
                                        : field.onChange(field.value?.filter((value) => value !== language.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{language.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Business Images
              </h2>
              <p className="text-gray-600">
                Upload high-quality images of your business. The main image will be featured prominently.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload Main Image</h3>
                  <p className="text-sm text-gray-500 mb-4">Drag and drop or click to browse</p>
                  <Button type="button" variant="outline">
                    Select File
                  </Button>
                  <p className="text-xs text-gray-500 mt-4">Recommended size: 1200 x 800 pixels. Max file size: 5MB.</p>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload Additional Images</h3>
                  <p className="text-sm text-gray-500 mb-4">Drag and drop or click to browse (up to 5 images)</p>
                  <Button type="button" variant="outline">
                    Select Files
                  </Button>
                  <p className="text-xs text-gray-500 mt-4">
                    Recommended size: 1200 x 800 pixels. Max file size: 5MB per image.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
                <p>
                  <strong>Note:</strong> All images will be reviewed to ensure they meet our quality standards and
                  guidelines. Images should accurately represent your business and not contain inappropriate content.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            )}

            {step < 6 ? (
              <Button type="button" onClick={nextStep} className="gap-2 ml-auto">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" className="gap-2 ml-auto" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Business"}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

