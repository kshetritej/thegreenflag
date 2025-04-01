import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Rating from "@/components/review/rating"
import FormErrorMessage from "../utils/formErrorMessage"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useState } from "react"

export default function AddNewReview({ businessId }: { businessId: string }) {
  const user = useSession();

  const [rating, setRating] = useState(0)
  const formSchema = z.object({
    content: z.string({ message: "Review is required." }).min(150, { message: "Review must be at least 250 characters long." }),
    rating: z.number({ message: "Rating is required." }).min(1, { message: "Rating is required" }).max(5, { message: "Rating must be between 1 and 5" }),
  })

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    defaultValues: {
      content: "",
      rating: 0,
    },
    resolver: zodResolver(formSchema),
    reValidateMode: "onBlur",
  })

  const submitReview = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      await axios.post("/api/business/review", { ...data, authorId: user.data?.user?.id, businessId })
    },
    onSuccess: () => {
      reset()
      setRating(0)
      toast.success("Review submitted successfully")
    },
    onError: () => {
      toast.error("Failed to submit review")
    }
  })
  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("form data", data)
    submitReview.mutate(data)
  }

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-2 space-y-2">
        <div>
          <Rating value={rating} onChange={(value) => setValue("rating", value)} />
          {errors.rating && <FormErrorMessage msg={errors.rating.message} />}
        </div>
        <div>
          <p className="font-medium text-2xl pb-4">Write your review</p>
          <Textarea  {...register("content")} placeholder="Write your review here..." cols={20} />
          {errors.content && <FormErrorMessage msg={errors.content.message} />}
        </div>

        <Button className="w-fit" type="submit">Sumbit</Button>
      </form>
    </div>
  )
}