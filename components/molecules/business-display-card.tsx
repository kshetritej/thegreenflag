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

export default function BusinessDisplayCard({ business, myBusiness }: { business: Business, myBusiness?: boolean }) {
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
      console.log("ERROR:", err)
      toast.error("Something went wrong!")
    }
  })

  return (
    <>
      {business &&
        <Card className="p-2 border-none relative"
          onClick={() => {
            router.push(`/business/${business.id}`)
          }}
        >
          <div className="relative aspect-square">
            <Image src={business?.mainImage || "/placeholder.svg"} alt={business?.name} fill className="object-cover rounded-lg border" />
            {business?.reviews?.length > 1 && (
              <Badge variant="secondary" className="absolute top-3 left-3 font-medium">
                Top Rated
              </Badge>
            )}
          </div>

          <CardContent className="p-3 pt-4">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-base">{business.name}</h3>
              <div className="flex items-center gap-1">
                <span className="text-sm"><LucideStar className="text-yellow-400 size-4" /></span>
                <span className="text-sm font-medium">{(business.reviews.reduce((acc, review) => acc + review.rating, 0) / business.reviews.length || 0).toFixed(1)}</span>
                <Badge className="rounded-full">{business.category.toString().charAt(0) + business.category.toString().slice(1).toLowerCase()}</Badge>
              </div>
            </div>

            <div className="text-sm mt-1 flex flex-col gap-0.5">
              <span>{business.street}, {business.city}</span>
            </div>
          </CardContent>
          {myBusiness &&
            <CardFooter className="flex gap-4 p-0">
              {/* <Button variant="secondary" size={'default'} className=" hover:cursor-pointer">
                <Pencil className="h-4 w-4" /> Edit
              </Button> */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  {/* <Button variant="destructive" size={'default'} className=" hover:cursor-pointer">
                    <Trash className="h-4 w-4" /> Delete
                  </Button> */}
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

