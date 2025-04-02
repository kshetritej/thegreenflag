"use client"

import { Share2, Flag, ThumbsUp, Trash } from "lucide-react"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Review } from "@prisma/client"
import { useSession } from "next-auth/react"
import { AlertDialog, AlertDialogTrigger, AlertDialogTitle, AlertDialogDescription, AlertDialogHeader, AlertDialogCancel, AlertDialogAction, AlertDialogFooter, AlertDialogContent } from "../ui/alert-dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ListReviews({ reviews }: { reviews: Review[] }) {
  const session = useSession();
  const userId = session.data?.user?.id
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutate: deleteReview } = useMutation({
    mutationFn: async (reviewId: string) => await axios.delete("/api/business/review", {
      data: {
        userId,
        reviewId
      }
    }),
    mutationKey: ["deleteReview"],
    onSuccess: () => {
      toast.success("Review deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
      router.refresh()
    },
    onError: () => {
      toast.error("Failed to delete review")
    }
  })
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id}>
          <div className="border rounded-lg p-6" key={review.id}>
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{review?.author?.name}</div>
                  <div className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    }
                  )}</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-1">{review.rating}</span>
                <Star className="w-4 h-4 fill-gray-800 text-gray-800" />
              </div>
            </div>

            <p className="text-gray-700 mb-4">
              {review.content}
            </p>

            <div className="flex items-center gap-4">
              <Button variant={'ghost'} size="sm" className="gap-2">
                <ThumbsUp className="w-4 h-4" />
                Helpful 
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Flag className="w-4 h-4" />
                Report
              </Button>
              {userId === review.authorId && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Trash className="w-4 h-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your revies
                        from this business and from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteReview(review.id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}