import { Share2, Flag, ThumbsUp } from "lucide-react"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Review } from "@prisma/client"

export default function ListReviews({ reviews }: { reviews: Review[] }) {
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
                  <div className="font-medium">{review.author.name}</div>
                  <div className="text-sm text-gray-500">{review.createdAt}</div>
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
              <Button variant="outline" size="sm" className="gap-2">
                <ThumbsUp className="w-4 h-4" />
                Helpful (24)
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Flag className="w-4 h-4" />
                Report
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}