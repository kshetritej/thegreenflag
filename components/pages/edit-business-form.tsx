"use client"

import React, { useState } from "react"
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
import { Building, MapPin, Phone, Upload, ArrowLeft, Check, LucideX } from "lucide-react"
import axios from "axios"
import { AddBusinessFormSchema } from "@/src/validations/business/add-business.validation"
import { amenitiesOptions } from "@/lib/constants/amenitiesOptions"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { businessCategory } from "@/lib/constants/businessCategory"
import { useEdgeStore } from "@/lib/edgestore"
import { Business } from "@prisma/client"
import { SingleImageDropzone } from "../edgestore/SingleImageDropzone"
import Info from "../atoms/info-modal"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"
import MyToolTip from "../atoms/MyTooltip"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"

type FormValues = z.infer<typeof AddBusinessFormSchema>

export default function EditBusinessForm({ business }: { business: Business }) {
  const [file, setFile] = useState<File | null>(null)
  const [tags, setTags] = useState<string[]>(business.tags || [])
  const [successMessage, setSuccessMessage] = useState<string>("")
  const router = useRouter()
  const { edgestore } = useEdgeStore()

  const form = useForm<FormValues>({
    resolver: zodResolver(AddBusinessFormSchema),
    defaultValues: {
      name: business.name,
      category: business.category,
      subcategory: business.subcategory || "",
      street: business.street,
      city: business.city,
      state: business.state || "",
      country: business.country,
      postalCode: business.postalCode || "",
      description: business.description,
      establishedYear: business.establishedYear?.toString() || "",
      amenities: business.amenities,
      phone: business.phone,
      email: business.email,
      website: business.website || "",
      hours: business.hours || "",
      googleMapsUrl: business.googleMapsUrl || "",
      ownerId: business.ownerId,
      logo: business.logo || "",
      tags: business.tags || []
    },
  })

  const editBusinessMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await axios.put(`/api/business/${business.id}`, data)
      return response.data
    },
    onSuccess: (res) => {
      setSuccessMessage(res.message)
      toast.success("Business updated successfully")
      setTimeout(() => {
        router.push("/dashboard/businesses")
      }, 2000)
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!")
    }
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      let logoUrl = business.logo

      if (file) {
        // Upload the new logo file
        const logoRes = await edgestore.publicFiles.upload({
          file,
        })
        logoUrl = logoRes.url
      }

      // Update the form data with the logo URL and tags
      editBusinessMutation.mutate({
        ...data,
        // @ts-expect-error  its is assignable
        logo: logoUrl,
        tags: tags.filter((tag) => tag.trim() !== ""),
      })
    } catch (error) {
      console.error("Error uploading logo:", error)
      toast.error("Failed to upload logo. Please try again.")
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <CardTitle className="text-2xl font-bold">Edit Business</CardTitle>
        <CardDescription>
          Update your business information
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

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

              <div>
                <Label>Logo</Label>
                <SingleImageDropzone
                  dropzoneOptions={{
                    maxFiles: 1,
                    maxSize: 1024 * 1024 * 5, // 5MB
                  }}
                  width={200}
                  height={200}
                  // @ts-expect-error it is what it is
                  value={file}
                  // @ts-expect-error it is what it is
                  onChange={(file) => setFile(file)}
                />
                {business.logo && !file && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Current logo:</p>
                    <img src={business.logo} alt="Current logo" className="w-32 h-32 object-cover rounded-md mt-1" />
                  </div>
                )}
              </div>

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
                          {businessCategory.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.label}
                            </SelectItem>
                          ))}
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
                name="street"
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

              <Separator />

              <h3 className="text-lg font-medium">Description</h3>

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
                name="establishedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Established Year</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2015" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label>Tags (comma separated)</Label>
                <div className="flex gap-1 flex-wrap py-2">
                  {tags.slice(0, -1).map((tag: string, index: number) => (
                    <Badge key={index} variant={'outline'}>{tag}</Badge>
                  ))}
                  {tags.length > 1 && (
                    <MyToolTip content={"Clear Tags"}>
                      <Button size="icon" onClick={() => setTags([])}><LucideX className="size-4" /></Button>
                    </MyToolTip>
                  )}
                </div>
                <Textarea
                  placeholder="Tags"
                  value={tags.join(",")}
                  onChange={(e) => setTags(e.target.value.split(","))}
                />
              </div>

              <Separator />

              <h3 className="text-lg font-medium">Amenities & Features</h3>
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

              <Separator />

              <h3 className="text-lg font-medium flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </h3>

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
                  name="googleMapsUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google Maps Url (iframe)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., https://goo.gl/maps/1234567890/iframe" {...field} />
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

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={editBusinessMutation.isPending}
              >
                {editBusinessMutation.isPending ? "Updating..." : "Update Business"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
} 