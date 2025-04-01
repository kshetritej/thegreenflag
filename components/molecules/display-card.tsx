"use client"

import { Heart, LucideStar, Pencil, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { Business } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ReviewCard({ business, myBusiness }: { business: Business, myBusiness?: boolean }) {
  const router = useRouter()

  const deleteBusiness = useMutation({
    mutationFn: async () => {
      const response = await axios.delete(`/api/business/${business.id}`)
      return response.data
    },
    mutationKey: ["deleteBusiness"],
    onSuccess: (res) => {
      toast.success(res.message)
      router.refresh()
    },
    onError: (err) => toast.error("Something went wrong!")
  })

  return (
    <>
      {business &&
        <Card className="p-1 overflow-hidden relative" onClick={() => router.push(`/business/${business.id}`)}>
      <div className="relative aspect-square">
            <Image src={business?.mainImage || "/placeholder.svg"} alt={business?.name} fill className="object-cover rounded-lg" />
        {business.reviews.length > 1 && (
          <Badge variant="secondary" className="absolute top-3 left-3 bg-white text-black font-medium">
            Top Rated
          </Badge>
        )}
        <button className="hover:cursor-pointer absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
          <Heart className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <CardContent className="p-3 pt-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-base">{business.name}</h3>
          <div className="flex items-center gap-1">
            <span className="text-sm"><LucideStar className="text-yellow-400 size-4" /></span>
                <span className="text-sm font-medium">{(business.reviews.reduce((acc, review) => acc + review.rating, 0) / business.reviews.length || 0).toFixed(1)}</span>

          </div>
        </div>

        <div className="text-gray-500 text-sm mt-1 flex flex-col gap-0.5">
          <p>{business.category}</p>
          <span>{business.street}, {business.city}</span>
        </div>
      </CardContent>
          {myBusiness &&
            <CardFooter className="flex gap-4">
              <Button variant="secondary" className=" hover:cursor-pointer">
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant="destructive" className=" hover:cursor-pointer">
                    <Trash className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter> <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteBusiness.mutate()}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

            </CardFooter>
          }
    </Card>
      }
    </>
  )
}

