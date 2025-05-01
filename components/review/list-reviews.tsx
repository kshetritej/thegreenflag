"use client"

import { Flag, ThumbsUp, Trash, LucideReply, LucideCornerDownRight } from "lucide-react"
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
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogTrigger, DialogClose, DialogFooter } from "../ui/dialog"
import { Textarea } from "../ui/textarea"
import { FieldValues } from "react-hook-form"
import { useForm } from "react-hook-form"

export default function ListReviews({ reviews, dashboard }: { reviews: Review[], dashboard?: boolean }) {
  const session = useSession();
  // @ts-expect-error will be available
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
      toast.success("Review removed successfully")
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
      router.refresh()
    },
    onError: () => {
      toast.error("Failed to delete review")
    }
  })

  const { mutate: replyReview } = useMutation({
    mutationFn: async (data: { content: string, authorId: string, reviewId: string }) => await axios.post(`/api/business/review/reply`, data),
    onSuccess: () => {
      toast.success("Reply added successfully")
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
      router.refresh()
    },
    onError: () => {
      toast.error("Failed to add reply")
    }
  })

  const { register, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      content: ""
    }
  })
  return (
    <div className="space-y-6">
      {reviews?.map((review) => (
        <div key={review.id}>
          <div className="border rounded-lg p-6" key={review.id}>
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  {/* @ts-expect-error it exist */}
                  <AvatarImage src={review?.author?.profileImage } alt="User" className="object-cover" />
                  {/* @ts-expect-error it exist */}
                  <AvatarFallback>{review?.author?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  {/* @ts-expect-error it exist */}
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
                <Star className="w-4 h-4 fill-gray-800" />
              </div>
            </div>

            <p className="mb-4">
              {review.content}
            </p>
            <div className="grid md:grid-col-3 lg:grid-cols-4 gap-4">
              {review.images.map((image, index) => (
                <Link href={image} key={index}>
                  <Image width={100} height={100} key={index} src={image} alt={`Review Image ${index}`} className="w-full h-auto mb-4 rounded-md" />
                </Link>
              ))}
            </div>

            {/*@ts-expect-error replies exist on review*/}
            {review?.replies?.length > 0 &&
              <div className="bg-secondary p-2 rounded-md">
                <p className="font-bold flex items-center gap-2"><LucideCornerDownRight /> Owner Response</p>
                {/*@ts-expect-error replies exist on review*/}
                {review?.replies?.map((reply: any, index: number) => <p className="ml-8" key={index}>{reply.content}</p>)}
              </div>
            }

            <div className="flex items-center gap-4 mt-4">
              <Button variant={'ghost'} className="gap-2"
                onClick={() => toast.success("Thank you for your feedback!")}
              >
                <ThumbsUp className="w-4 h-4" />
                Helpful
              </Button>
              <Button variant="ghost" className="gap-2">
                <Flag className="w-4 h-4" />
                Report
              </Button>
              {dashboard &&
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="gap-2"><LucideReply />
                      Reply
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      {/* @ts-expect-error it exist */}
                      <DialogTitle>Reply to {review.author?.name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit((data) => replyReview({ content: data.content, authorId: userId, reviewId: review.id }))} className="space-y-4">
                      <Textarea {...register("content")} placeholder="Reply to the review" />
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Reply</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              }
              {(userId === review.authorId || dashboard) && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <Trash className="w-4 h-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your reviews
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
