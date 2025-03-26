import { Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface ReviewCardProps {
  image: string
  title: string
  location: string
  rating: number
  isFavorite?: boolean
  distance: string
  category: string
}

export default function ReviewCard({
  image = "/placeholder.svg?height=300&width=300",
  title = "Himalayan Cafe",
  location = "Lalitpur, Nepal",
  rating = 4.96,
  isFavorite = true,
  distance = "1.2 miles away",
  category = "Restaurant",
}: ReviewCardProps) {
  return (
    <Card className="w-full max-w-[300px] overflow-hidden border-none shadow-sm">
      <div className="relative aspect-square">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover rounded-lg" />
        {isFavorite && (
          <Badge variant="secondary" className="absolute top-3 left-3 bg-white text-black font-medium">
            Top rated
          </Badge>
        )}
        <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
          <Heart className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <CardContent className="p-3 pt-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-base">{location}</h3>
          <div className="flex items-center gap-1">
            <span className="text-sm">★</span>
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>

        <div className="text-gray-500 text-sm mt-1 flex flex-col gap-0.5">
          <span>{distance}</span>
          <span>{category}</span>
        </div>
      </CardContent>
    </Card>
  )
}

