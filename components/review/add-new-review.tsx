import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Rating from "@/components/review/rating"
import FormErrorMessage from "@/components/utils/formErrorMessage"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { FileState, MultiImageDropzone } from "@/components/edgestore/MultiImageDropzone"
import { useEdgeStore } from "@/lib/edgestore"
import { useRouter } from "next/navigation"

export default function AddNewReview({ businessId }: { businessId: string }) {
  const user = useSession();
  const router = useRouter();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [fileStates, setFileStates] = useState<FileState[]>([])

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
      await axios.post("/api/business/review", { ...data, authorId: user.data?.user?.id, businessId, images: imageUrls })
    },
    onSuccess: () => {
      reset()
      setRating(0)
      setFileStates([])
      setImageUrls([])
      toast.success("Review submitted successfully")
      router.refresh()
    },
    onError: () => {
      toast.error("Failed to submit review")
    }
  })
  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    if(!user?.data?.user?.id) {
      toast.error("You must be logged in to submit a review")
      return
    }
    submitReview.mutate(data)
  }

  return (
    <div className="p-6 border rounded-md">
      <p className="font-medium text-2xl pb-4 mt-4">Add Images</p>
      <MultiImageDropzone value={fileStates}
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
      <Button className="w-fit mt-4 mb-4" onClick={() => uploadImages(fileStates)}>Upload Images </Button>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-2 space-y-2">
        <div>
          <Rating value={rating} onChange={(value) => setValue("rating", value)} />
          {errors.rating && <FormErrorMessage msg={errors.rating.message} />}
        </div>
        <div>
          <p className="font-medium text-2xl pb-4">Write your review</p>
          <textarea  {...register("content")} placeholder="Write your review here..." className="w-full rounded-md  border p-4" rows={12} />
          {errors.content && <FormErrorMessage msg={errors.content.message} />}

        </div>

        <Button className="w-full" disabled={submitReview.isPending} type="submit">{submitReview.isPending ? "Submitting...": "Submit"}</Button>
      </form>
    </div>
  )
}