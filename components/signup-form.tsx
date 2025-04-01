"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"
import axios from "axios"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Github, ArrowRight, Loader2 } from "lucide-react"
import { SingleImageDropzone } from "./edgestore/SingleImageDropzone"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useEdgeStore } from "@/lib/edgestore"
import { useRouter } from "next/navigation"

type FormData = {
  name: string
  email: string
  username: string
  phone: string
  address: string
  bio: string
  isEnglishSpeaking: boolean
  password: string
  profileImage: string
}


export default function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
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
      name: "",
      email: "",
      username: "",
      phone: "",
      address: "",
      bio: "",
      isEnglishSpeaking: false,
      password: "",
      profileImage: "",
    },
  })

  const isEnglishSpeaking = watch("isEnglishSpeaking")

  const registerUser = useMutation({
    mutationFn: async (data: FormData) => {
      await axios.post("/api/signup", data)
    },
    onSuccess: (data) => {
      toast.success("Account created successfully, sign in to continue")
      router.push("/login")
    },
    onError: (error) => toast.error("Something went wrong"),
  }) 


  const onSubmit = async (data: FormData) => {
    if(!file) {
      toast.error("Please upload a profile image")
      return
    }
    if(file) {
      setIsLoading(true)
      if (file) {
            const res = await edgestore.publicFiles.upload({
              file,
            });
            registerUser.mutate({...data, profileImage: res.url})
          }
    }
    setIsLoading(false)
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Create a new account</CardTitle>
          <CardDescription className="text-center">
            Enter your details below to create your account and get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className={cn("space-y-6", className)} onSubmit={handleSubmit(onSubmit)} {...props}>
            <div className="space-y-4">
              <Label htmlFor="profile-image">Profile Image</Label>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name field */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    {...register("name", { required: "Full name is required" })}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                {/* Email field */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Username field */}
                <div className="space-y-2">
                  <Label htmlFor="username">
                    Username <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="username"
                    placeholder="johndoe"
                    {...register("username", { required: "Username is required" })}
                    className={errors.username ? "border-red-500" : ""}
                  />
                  {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone field */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="123-456-7890" {...register("phone")} />
                </div>

                {/* Address field */}
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Main St, City, Country" {...register("address")} />
                </div>
              </div>

              {/* Bio field */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a little about yourself..."
                  className="resize-none min-h-[100px]"
                  {...register("bio")}
                />
              </div>

              {/* English Speaking checkbox */}
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

            <div className="space-y-4">
              <Button type="submit" className="w-full" disabled={isSubmitting || isLoading || registerUser.isPending}>
                {isSubmitting || isLoading || registerUser.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Register
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" type="button">
                <Github className="mr-2 h-4 w-4" />
                Login with GitHub
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t p-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline font-medium">
              Sign In
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
