import { Heart, LucideStar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Business } from "@prisma/client"


export default function ReviewCard(business: Business) {
  return (
    <Card className="p-1 overflow-hidden">
      <div className="relative aspect-square">
        <Image src={business.mainImage || "/placeholder.svg"} alt={business.name} fill className="object-cover rounded-lg" />
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
            <span className="text-sm font-medium">{business.reviews.reduce((acc, review) => acc + review.rating, 0) / business.reviews.length || 0}</span>
          </div>
        </div>

        <div className="text-gray-500 text-sm mt-1 flex flex-col gap-0.5">
          <p>{business.category}</p>
          <span>{business.street}, {business.city}</span>
        </div>
      </CardContent>
    </Card>
  )
}

