"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { SingleImageDropzone } from "../edgestore/SingleImageDropzone"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useEdgeStore } from "@/lib/edgestore"
import { User } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Loader2, X } from "lucide-react"
import axios from "axios"

type FormData = {
  name: string
  username: string
  phone: string
  address: string
  bio: string
  isEnglishSpeaking: boolean
  profileImage: string
}

export default function EditProfileForm({ user, onCancel }: { user: User, onCancel: () => void }) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const { edgestore } = useEdgeStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      phone: user.phone || "",
      address: user.address || "",
      bio: user.bio || "",
      isEnglishSpeaking: user.languages?.includes("English") || false,
      profileImage: user.profileImage || "",
    },
  })

  const isEnglishSpeaking = watch("isEnglishSpeaking")

  const updateProfile = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await axios.put(`/api/user/${user.id}`, data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Profile updated successfully")
      router.refresh()
      onCancel()
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || "Something went wrong"
      toast.error(errorMessage)
    }
  })

  const onSubmit = async (data: FormData) => {
    try {
      let profileImageUrl = user.profileImage

      if (file) {
        const res = await edgestore.publicFiles.upload({
          file,
        })
        profileImageUrl = res.url
      }

      updateProfile.mutate({
        ...data,
        profileImage: profileImageUrl,
      })
    } catch (error) {
      console.error("Error uploading profile image:", error)
      toast.error("Failed to upload profile image. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Edit Profile</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-between gap-4">
        <div className="w-full flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">
              Username <span className="text-red-500">*</span>
            </Label>
            <Input
              id="username"
              placeholder="ironman"
              {...register("username", { required: "Username is required" })}
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Tony Stark"
              {...register("name", { required: "Full name is required" })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="123-456-7890"
              {...register("phone")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="123 Main St, City, Country"
              {...register("address")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us a little about yourself..."
              className="resize-none min-h-[100px]"
              {...register("bio")}
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="english-speaking"
              checked={isEnglishSpeaking}
              onCheckedChange={(checked) => {
                setValue("isEnglishSpeaking", checked as boolean)
              }}
            />
            <Label htmlFor="english-speaking" className="font-normal">
              I speak English
            </Label>
          </div>
        </div>

        <div>
          <Label htmlFor="profile-image" className="mb-2">Profile Image</Label>
          <SingleImageDropzone
            dropzoneOptions={{
              maxFiles: 1,
              maxSize: 1024 * 1024 * 5, // 5MB
            }}
            width={200}
            height={200}
            value={file}
            onChange={(file) => setFile(file)}
          />
          {user.profileImage && !file && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">Current profile image:</p>
              <img src={user.profileImage} alt="Current profile" className="w-32 h-32 object-cover rounded-md mt-1" />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || updateProfile.isPending}
        >
          {isSubmitting || updateProfile.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  )
} 