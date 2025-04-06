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
import { Building, MapPin, Phone, Upload, ChevronRight, ChevronLeft, Check } from "lucide-react"
import axios from "axios"
import AddBusinessSuccessCard from "@/components/molecules/add-business-success-card"
import { AddBusinessFormSchema } from "@/src/validations/business/add-business.validation"
import { amenitiesOptions } from "@/lib/constants/amenitiesOptions"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { businessCategory } from "@/lib/constants/businessCategory"
import { useEdgeStore } from "@/lib/edgestore"
import { User } from "@prisma/client"
import { FileState, MultiImageDropzone } from "../edgestore/MultiImageDropzone"


type FormValues = z.infer<typeof AddBusinessFormSchema>


export default function AddBusinessForm({ user }: { user: User }) {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [step, setStep] = useState(1)

  const { edgestore } = useEdgeStore()
  function updateFileProgress(key: string, progress: FileState['progress']) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key,
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  console.log("user from form", user)

  const form = useForm<FormValues>({
    resolver: zodResolver(AddBusinessFormSchema),
    defaultValues: {
      name: "",
      category: "",
      subcategory: "",
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      description: "",
      establishedYear: "",
      amenities: [],
      phone: "",
      email: "",
      website: "",
      hours: "",
      mainImage: "",
      googleMapsUrl: "",
      additionalImages: [],
      ownerId: user.id,
    },
  })

  const addBusinessMutation = useMutation({
    mutationFn: (data: FormValues) => axios.post("/api/business", data),
    onSuccess: (res) => {
      toast.success("Business added successfully")
    },
    onError: (err) => {
      toast.error("Something went wrong")
    }
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (imageUrls.length === 0) {
      toast.error("Please upload at least one image")
      return
    }

    addBusinessMutation.mutate({
      ...data,
      mainImage: imageUrls[0],
      additionalImages: imageUrls.slice(1),
    })
  }
  console.log("imageUrls", imageUrls)
  console.log("fileStates", fileStates)

  function uploadImages(addedFiles: FileState[]) {
    return addedFiles.map(async (addedFileState) => {
      try {
        const res = await edgestore.publicFiles.upload({
          file: addedFileState.file as File,
          onProgressChange: async (progress) => {
            updateFileProgress(addedFileState.key, progress);
            if (progress === 100) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              updateFileProgress(addedFileState.key, 'COMPLETE');
            }
          },
        });
        setImageUrls((prev) => [...prev, res.url]);
      } catch (err) {
        updateFileProgress(addedFileState.key, 'ERROR');
        toast.error("Failed to upload image");
      }
    })
  }

  const handleImageUpload = async () => {
    if (fileStates.length === 0) {
      toast.error("Please select at least one image");
      return;
    }
    await uploadImages(fileStates);
    toast.success("Images uploaded successfully");
  }

  const nextStep = async () => {
    let canProceed = false

    if (step === 1) {
      const basicInfoFields = ["name", "category", "street", "city", "country"]
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

  if (addBusinessMutation.isSuccess) {
    return (
      <AddBusinessSuccessCard />
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">Add Your Business</h1>
      <p className="text-gray-600 mb-8">Complete the form below to add your business to our platform.</p>

      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
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
                {stepNumber === 5 && "Images"}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 h-1 mt-4 rounded-full">
          <div
            className="bg-primary h-1 rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
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
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Business Images
              </h2>
              <p className="text-gray-600">
                Upload high-quality images of your business. The first image will be featured prominently.
              </p>
              <div>
                <MultiImageDropzone
                  value={fileStates}
                  dropzoneOptions={{
                    maxFiles: 6,
                  }}
                  onChange={(files) => {
                    setFileStates(files);
                  }}
                  onFilesAdded={async (addedFiles) => {
                    setFileStates([...fileStates, ...addedFiles]);
                  }}
                />
              </div>
              <Button
                type="button"
                onClick={handleImageUpload}
                disabled={fileStates.length === 0}
              >
                Upload Images
              </Button>

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

            {step < 5 ? (
              <Button type="button" onClick={nextStep} className="gap-2 ml-auto">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
                <Button
                  type="button"
                  onClick={form.handleSubmit(onSubmit)}
                  className="gap-2 ml-auto"
                  disabled={addBusinessMutation.isPending || imageUrls.length === 0}
                >
                  {addBusinessMutation.isPending ? "Submitting..." : "Submit Business"}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

