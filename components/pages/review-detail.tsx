"use client"

import RatingComponent from "@/components/organisms/rating-component"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ThumbsUp,
  Flag,
  Share2,
  Star,
  Heart,
  Info,
  Clock,
  MapPin,
  Utensils,
  Wifi,
  CreditCard,
  ParkingMeterIcon as Parking,
  Coffee,
  Accessibility,
  Phone,
  Globe,
  Mail,
  MessageSquare,
  Check,
  X,
  Cigarette,
} from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Business } from "@prisma/client"
import OwnerInfoCard from "@/components/review/owner-info-card"
import { useState, useEffect } from "react"
import axios from "axios"
import AddNewReview from "@/components/review/add-new-review"
import { cn } from "@/lib/utils"
import { AiGeneratedBadge } from "../utils/aiGeneratedBadge"
import ListReviews from "../review/list-reviews"

interface SentimentAnalysis {
  percentage: string
  reviews: string
}

interface GroqResponse {
  ai_summary: string
  rating_analysis: {
    overall_rating: number
    pros: string[]
    cons: string[]
    service: number
    quality: number
    ambience: number
    location: number
    value: number
    recommendation: string
  }
  sentiment_analysis: {
    positive: SentimentAnalysis
    negative: SentimentAnalysis
    neutral: SentimentAnalysis
  }
  most_mentioned_words: {
    positive: string[]
    negative: string[]
    neutral: string[]
  }
}

const amenityIconMap = {
  wifi: { icon: Wifi, label: "Free WiFi" },
  parking: { icon: Parking, label: "Parking Available" },
  creditCard: { icon: CreditCard, label: "Credit Card Accepted" },
  accessibility: { icon: Accessibility, label: "Wheelchair Accessible" },
  coffee: { icon: Coffee, label: "Coffee Available" },
  smokingArea: { icon: Cigarette, label: "Smoking Area" },
  restaurant: { icon: Utensils, label: "Restaurant" },
  phone: { icon: Phone, label: "Phone Service" },
  website: { icon: Globe, label: "Website" },
  email: { icon: Mail, label: "Email Contact" }
} as const

type AmenityKey = keyof typeof amenityIconMap

const formatAmenityText = (amenity: string): string => {
  return amenity
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim()
}

export default function ReviewDetail({ business }: { business: Business }) {
  const [summary, setSummary] = useState<GroqResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await axios.post(`/api/groq`, {
          prompt: `${JSON.stringify(business)}`
        })
        const parsedData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data
        setSummary(parsedData)
      } catch (error) {
        console.error('Error fetching summary:', error)
        setError('Failed to load AI analysis')
      } finally {
        setIsLoading(false)
      }
    }
    fetchSummary()
  }, [business])

  const LoadingPlaceholder = () => (
    <div className="animate-pulse space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  )

  const ErrorMessage = () => (
    <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-100">
      <p>Unable to generate AI analysis at the moment. Please try again later.</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
      <div className="flex items-center gap-2 text-gray-600 mb-6">
        <span>{business.street}, {business.city},{business.state}, {business.country}, {business.postalCode}</span>
        <span>•</span>
        <span>{business.category}</span>
        <span>•</span>
        <span>{business.street} miles away</span>
      </div>

      {/* Image Gallery Section */}
      <div className="relative mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 rounded-lg overflow-hidden">
          <div className="col-span-2 relative aspect-[4/3]">
            <Image
              src={business.mainImage}
              alt={business.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-2">
            <div className="relative">
              <Image
                src={business.images[0]}
                alt={business.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="relative">
              <Image
                src={business.images[1] ?? business.mainImage}
                alt={business.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 rounded-full bg-white hover:bg-white/90 text-black"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Owner Description Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">About {business.name}</h2>
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={business.owner.profileImage} alt="Owner" />
            <AvatarFallback>{business.owner.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">Owned by {business.owner.name}</div>
            <div className="text-sm text-gray-500">Established {business.establishedYear} • Verified business</div>
          </div>

        </div>

        <div className="text-gray-700 space-y-4">
          <p>
            {business.description}
          </p>
        </div>
      </div>

      {/* Amenities Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {business.amenities.map((amenity) => {
            const amenityKey = amenity.toLowerCase().replace(/\s+/g, '') as AmenityKey
            const IconComponent = amenityIconMap[amenityKey]?.icon || Info

            return (
              <div key={amenity} className="flex items-center gap-2 text-gray-700">
                <IconComponent className="h-5 w-5 text-gray-600 flex-shrink-0" />
                <span className="text-sm">
                  {amenityIconMap[amenityKey]?.label || formatAmenityText(amenity)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top Rated Section with AI Summary */}
      <div className="mb-8 border rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-3">Top Rated</h2>
            <AiGeneratedBadge what="Summary" />

            {isLoading ? (
              <LoadingPlaceholder />
            ) : error ? (
              <ErrorMessage />
            ) : (
              <p className="text-gray-700 mb-4">
                    {summary?.ai_summary || "No summary available"}
                  </p>
            )}
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg min-w-[140px]">
            <div className="text-3xl font-bold">
              {summary?.rating_analysis?.overall_rating?.toFixed(1) || "N/A"}
            </div>
            <div className="flex mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-4 w-4",
                    star <= (summary?.rating_analysis?.overall_rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  )}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600 font-medium">AI Rating</div>
          </div>
        </div>
      </div>

      {/* Pros and Cons Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Highlights</h2>
        <AiGeneratedBadge />
        {isLoading ? (
          <LoadingPlaceholder />
        ) : error ? (
          <ErrorMessage />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="font-medium mb-2 text-green-800 flex items-center gap-2">
                <Check className="h-4 w-4" />
                What People Love
              </h3>
              <ul className="space-y-1">
                {summary?.rating_analysis?.pros?.length ? (
                  summary.rating_analysis.pros.map((pro, index) => (
                    <li key={index} className="text-green-700 flex items-start gap-2">
                      <span className="mt-1.5">•</span>
                      <span>{pro}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-green-700">No highlights available yet</li>
                )}
              </ul>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <h3 className="font-medium mb-2 text-red-800 flex items-center gap-2">
                <X className="h-4 w-4" />
                Areas for Improvement
              </h3>
              <ul className="space-y-1">
                {!summary?.rating_analysis?.cons?.length ? (
                  <li className="text-red-700 flex items-start gap-2">
                    <span className="mt-1.5">•</span>
                    <span>Not enough data to identify areas for improvement</span>
                  </li>
                ) : summary.rating_analysis.cons[0] === "none mentioned" ? (
                  <li className="text-red-700 flex items-start gap-2">
                    <span className="mt-1.5">•</span>
                    <span>No areas for improvement identified</span>
                  </li>
                ) : (
                  summary.rating_analysis.cons.map((con, index) => (
                    <li key={index} className="text-red-700 flex items-start gap-2">
                      <span className="mt-1.5">•</span>
                      <span>{con}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Sentiment Analysis Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Review Sentiment Analysis</h2>
        {isLoading ? (
          <LoadingPlaceholder />
        ) : error ? (
          <ErrorMessage />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="border rounded-lg p-4">
                <div className="text-green-500 font-bold text-xl mb-2">
                      {summary?.sentiment_analysis?.positive?.percentage ?? "0"}%
                    </div>
                    <div className="text-sm text-gray-600">Positive</div>
                    <div className="mt-2 text-xs text-gray-500">
                      Based on {summary?.sentiment_analysis?.positive?.reviews ?? "0"} reviews
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-yellow-500 font-bold text-xl mb-2">
                      {summary?.sentiment_analysis?.neutral?.percentage ?? "0"}%
                    </div>
                    <div className="text-sm text-gray-600">Neutral</div>
                    <div className="mt-2 text-xs text-gray-500">
                      Based on {summary?.sentiment_analysis?.neutral?.reviews ?? "0"} reviews
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-red-500 font-bold text-xl mb-2">
                      {summary?.sentiment_analysis?.negative?.percentage ?? "0"}%
                    </div>
                    <div className="text-sm text-gray-600">Negative</div>
                    <div className="mt-2 text-xs text-gray-500">
                      Based on {summary?.sentiment_analysis?.negative?.reviews ?? "0"} reviews
                    </div>
                  </div>
                </div>

                <div className="mt-6 border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Most Mentioned Words</h3>
                  <div className="space-y-2">
                    {summary?.most_mentioned_words?.positive?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {summary.most_mentioned_words.positive.map((word, index) => (
                          <Badge key={index} className="bg-green-100 text-green-800 hover:bg-green-200">
                            {word}
                          </Badge>
                        ))}
                      </div>
                    ) : null}

                    {summary?.most_mentioned_words?.neutral?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {summary.most_mentioned_words.neutral.map((word, index) => (
                          <Badge key={index} className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                            {word}
                          </Badge>
                        ))}
                      </div>
                    ) : null}

                    {summary?.most_mentioned_words?.negative?.length &&
                      summary.most_mentioned_words.negative[0] !== "none" ? (
                      <div className="flex flex-wrap gap-2">
                          {summary.most_mentioned_words.negative.map((word, index) => (
                            <Badge key={index} className="bg-red-100 text-red-800 hover:bg-red-200">
                              {word}
                            </Badge>
                          ))}
                        </div>
                    ) : null}

                    {!summary?.most_mentioned_words?.positive?.length &&
                      !summary?.most_mentioned_words?.neutral?.length &&
                      !summary?.most_mentioned_words?.negative?.length && (
                        <p className="text-gray-500">No frequently mentioned words found</p>
                      )}
                  </div>
                </div>
          </>
        )}
      </div>

      {/* Detailed Ratings */}
      <RatingComponent
        reviewSummary={summary?.ai_summary || ""}
        overallRating={summary?.rating_analysis?.overall_rating || 0}
        serviceRating={summary?.rating_analysis?.service || 0}
        qualityRating={summary?.rating_analysis?.quality || 0}
        atmosphereRating={summary?.rating_analysis?.ambience || 0}
        responsiveness={summary?.rating_analysis?.service || 0}
        location={summary?.rating_analysis?.location || 0}
        value={summary?.rating_analysis?.value || 0}
        reviewCount={Number(summary?.sentiment_analysis?.positive?.reviews || 0) +
          Number(summary?.sentiment_analysis?.neutral?.reviews || 0) +
          Number(summary?.sentiment_analysis?.negative?.reviews || 0)}
      />

      <Separator className="my-8" />

      <div className="mb-8">
        <AddNewReview businessId={business.id} />
      </div>

      {/* Individual Reviews */}
      <div className="space-y-8 mb-8">
        <h2 className="text-2xl font-semibold">Recent Reviews</h2>
        <ListReviews reviews={business.reviews} />
      </div>

      {/* Map Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Location</h2>
        <div className="relative w-full h-[300px] rounded-lg overflow-hidden border">
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <MapPin className="h-8 w-8 text-gray-400" />
            <span className="sr-only">Map of Himalayan Cafe location</span>
          </div>
          <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
            <p className="font-medium">Lalitpur, Nepal</p>
            <p className="text-sm text-gray-600">1.2 miles from city center</p>
          </div>
        </div>
        <p className="mt-3 text-gray-600 text-sm">
          Located in a quiet neighborhood in Lalitpur, just a short walk from Patan Durbar Square. The area is known for
          its traditional architecture and cultural attractions.
        </p>
      </div>

      {/* Owner Details */}
      <OwnerInfoCard owner={business.owner} establishedYear={business.establishedYear} />
    </div>
  )
}

