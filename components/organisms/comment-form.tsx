"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

const formSchema = z.object({
  content: z.string().min(1, { message: "Comment cannot be empty" }).max(1000, {
    message: "Comment must not exceed 1000 characters",
  }),
  authorId: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface CommentFormProps {
  postId: string
}

export function CommentForm({ postId }: CommentFormProps) {
  const router = useRouter()

  const session = useSession()
  const user = session.data?.user

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      // @ts-expect-error it exists
      authorId: user?.id
    },
  })

  const postComment = useMutation({
    mutationFn: async (data: FormValues) => {
      // @ts-expect-error user id exists
      const response = await axios.post(`/api/post/${postId}/`, { ...data, authorId: user?.id })
      return response.data
    },
    onSuccess: () => {
      toast.success("Comment posted successfully")
      reset()
      router.refresh()
    },
    onError: () => {
      toast.error("Failed to post comment")
    },
  })

  const onSubmit = async (data: FormValues) => {
    postComment.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label
              htmlFor="comment"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Add a comment
            </Label>
            <Textarea
              id="comment"
              placeholder="Share your thoughts..."
              className="min-h-[100px] resize-y"
              {...register("content")}
              aria-invalid={errors.content ? "true" : "false"}
            />
            {errors.content && <p className="text-sm font-medium text-destructive">{errors.content.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={postComment.isPending || !user}>
            {postComment.isPending ? "Submitting..." : !user ? "Login to Comment" : "Post Comment"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
