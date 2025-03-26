import { CheckCircle, MapPin, MessageSquare, Star, ThumbsUp, DollarSign } from "lucide-react"

interface RatingComponentProps {
  overallRating: number
  serviceRating: number
  qualityRating: number
  atmosphereRating: number
  responsiveness: number
  location: number
  value: number
  reviewCount: number
}

export default function RatingComponent({
  overallRating = 4.84,
  serviceRating = 4.8,
  qualityRating = 4.9,
  atmosphereRating = 4.9,
  responsiveness = 4.9,
  location = 4.9,
  value = 4.7,
  reviewCount = 246,
}: RatingComponentProps) {
  const renderRatingBar = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={`h-1.5 w-16 rounded-full ${star <= Math.round(rating) ? "bg-gray-800" : "bg-gray-200"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex items-center justify-center mb-2">
          <div className="text-gray-500 rotate-90 mr-3">
            {/* Simplified laurel wreath left */}
            <div className="flex flex-col gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            </div>
          </div>

          <span className="text-6xl font-bold">{overallRating}</span>

          <div className="text-gray-500 -rotate-90 ml-3">
            {/* Simplified laurel wreath right */}
            <div className="flex flex-col gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2">Top rated</h3>
        <p className="text-gray-600 max-w-md">
          This place is a customer favorite based on ratings, reviews, and reliability
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-6 border-t border-b py-6">
        <div className="flex flex-col gap-2">
          <div className="font-medium">Overall rating</div>
          {renderRatingBar(overallRating)}
          <div className="text-sm text-gray-500">{reviewCount} reviews</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="font-medium">Service</div>
          <div className="text-xl font-semibold my-2">{serviceRating}</div>
          <ThumbsUp className="w-6 h-6 text-gray-600" />
        </div>

        <div className="flex flex-col items-center">
          <div className="font-medium">Quality</div>
          <div className="text-xl font-semibold my-2">{qualityRating}</div>
          <CheckCircle className="w-6 h-6 text-gray-600" />
        </div>

        <div className="flex flex-col items-center">
          <div className="font-medium">Atmosphere</div>
          <div className="text-xl font-semibold my-2">{atmosphereRating}</div>
          <Star className="w-6 h-6 text-gray-600" />
        </div>

        <div className="flex flex-col items-center">
          <div className="font-medium">Responsiveness</div>
          <div className="text-xl font-semibold my-2">{responsiveness}</div>
          <MessageSquare className="w-6 h-6 text-gray-600" />
        </div>

        <div className="flex flex-col items-center">
          <div className="font-medium">Location</div>
          <div className="text-xl font-semibold my-2">{location}</div>
          <MapPin className="w-6 h-6 text-gray-600" />
        </div>

        <div className="flex flex-col items-center">
          <div className="font-medium">Value</div>
          <div className="text-xl font-semibold my-2">{value}</div>
          <DollarSign className="w-6 h-6 text-gray-600" />
        </div>
      </div>
    </div>
  )
}

