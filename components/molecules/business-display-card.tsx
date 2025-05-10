"use client"

import { LucideStar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Business } from "@prisma/client"

export default function BusinessDisplayCard({ business }: { business: Business }) {
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
    onError: (err) => {
      toast.error(err.message || "Something went wrong!")
    }
  })

  console.log("Businesses", business)
  return (
    <>
      {business &&
        <Card className="border-none relative hover:cursor-pointer p-0"
          onClick={() => {
            router.push(`/business/${business.id}`)
          }}
        >
          <div className="relative aspect-square">
            <Image src={business?.mainImage || business?.images[0]} alt={business?.name} fill className="object-cover rounded-t-lg border" />
            <Badge className="rounded-full absolute top-3 right-3">{business.category.toString().charAt(0) + business.category.toString().slice(1).toLowerCase()}</Badge>
            {/* @ts-expect-error it exist */}
            {business?.reviews?.length > 1 && (
              <Badge className="absolute top-3 px-4 py-2 left-3 font-medium rounded-full border-none bg-primary text-white">
                <LucideStar className="fill-white" /> Top Rated
              </Badge>
            )}
          </div>

          <CardFooter className="p-4 flex flex-col gap-2 justify-start items-start">
            <div>
              <h3 className="font-medium text-base">{business.name.length > 40 ? business.name.toString().substring(0, 35) + "..." : business.name}</h3>
              <div className="flex items-center gap-1">
                <span className="text-sm"><LucideStar className="text-yellow-400 fill-yellow-400 size-4" /></span>
                {/* @ts-expect-error it exist */}
                <span className="text-sm font-medium">{(business.reviews.reduce((acc, review) => acc + review.rating, 0) / business.reviews.length || 0).toFixed(1)}</span>
              </div>
            </div>

            <div className="text-sm mt-1 flex flex-col gap-0.5">
              <span>{business.street}, {business.city}</span>
            </div>
          </CardFooter>
        </Card>
      }
    </>
  )
}

