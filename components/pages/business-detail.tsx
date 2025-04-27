"use client"

import RatingComponent from "@/components/organisms/rating-component"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Star, 
  Lock,
  Heart,
  Info,
  Wifi,
  Accessibility,
  Check,
  X,
  Cigarette,
  LucideVerified,
  ArrowUpDown,
  Bell,
  Clock,
  Dog,
  Flower2,
  Luggage,
  Package,
  ParkingCircle,
  Shield,
  Shirt,
  Snowflake,
  Toilet,
  TreePine,
  Wallet,
  LucideArrowUpRight,
  Router,
} from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Business } from "@prisma/client"
import OwnerInfoCard from "@/components/review/owner-info-card"
import { useState, useEffect } from "react"
import axios from "axios"
import AddNewReview from "@/components/review/add-new-review"
import { cn } from "@/lib/utils"
import { AiGeneratedBadge } from "@/components/utils/aiGeneratedBadge"
import ListReviews from "@/components/review/list-reviews"
import { formatAmenityText } from "@/components/utils/formatAminity"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Link from "next/link"

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
  wifi: { icon: Wifi, label: "Free Wi-Fi" },
  parking: { icon: ParkingCircle, label: "Parking Available" },
  airConditioning: { icon: Snowflake, label: "Air Conditioning" },
  frontDesk24Hours: { icon: Clock, label: "24-Hour Front Desk" },
  petFriendly: { icon: Dog, label: "Pet Friendly" },
  elevator: { icon: ArrowUpDown, label: "Elevator Access" },
  disabledAccess: { icon: Accessibility, label: "Wheelchair Accessible" },
  backyard: { icon: TreePine, label: "Backyard Area" },
  smokingArea: { icon: Cigarette, label: "Smoking Area" },
  laundry: { icon: Shirt, label: "Laundry Service" },
  roomService: { icon: Bell, label: "Room Service" },
  safe: { icon: Lock, label: "In-Room Safe" },
  security: { icon: Shield, label: "Security Provided" },
  atm: { icon: Wallet, label: "ATM Available" },
  garden: { icon: Flower2, label: "Garden Area" },
  luggageStorage: { icon: Luggage, label: "Luggage Storage" },
  vendingMachine: { icon: Package, label: "Vending Machine" },
  restrooms: { icon: Toilet, label: "Restrooms Available" }
} as const;


type AmenityKey = keyof typeof amenityIconMap


export default function BusinessDetail({ business }: { business?: Business }) {
  const [summary, setSummary] = useState<GroqResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const session = useSession()

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
    <div className="p-4 max-w-4xl mx-auto py-8 px-4">
      <div className="flex gap-4 items-center">
        <h1 className="flex items-center text-3xl font-bold mb-2">
          {business?.name}{!business?.verified && <LucideVerified fill="limegreen" className="text-white ml-2" />}
          {business?.jobs?.length > 0 && <Link href={`/business/${business?.id}/jobs`}> <Badge className="w-fit  h-fit rounded-full ml-4  bg-orange-600">We are Hiring <LucideArrowUpRight /> </Badge> </Link>}
        </h1>
      </div>
      <div className="flex flex-col items-start gap-2  mb-6">
        <p>{business?.street}, {business?.city}, {business?.state}, {business?.country}</p>
      </div>

      {/* Image Gallery Section */}
      <div className="relative mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 rounded-lg overflow-hidden">
          <div className="col-span-2 relative aspect-[4/3]">
            <Image
              src={business?.mainImage}
              alt={business?.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-2">
            <div className="relative">
              <Image
                src={business?.images[0]}
                alt={business?.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="relative">
              <Image
                src={business?.images[1] ?? business?.mainImage}
                alt={business?.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Owner Description Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">About {business?.name}</h2>
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={business?.owner?.profileImage} alt="Owner" />
            <AvatarFallback>{business?.owner?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">Owned by {business?.owner?.name}</div>
            {/* <div className="text-sm">Established {business?.establishedYear} {!business?.verified && <span> • Verified business </span>}</div> */}
            <div className="text-sm ">Added {new Date(business?.createdAt).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" })}</div>
          </div>
        </div>

        <div className="space-y-4">
          <p>
            {business?.description}
          </p>
        </div>
      </div>

      {/* Amenities Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {business?.amenities.map((amenity) => {
            const amenityKey = amenity.toLowerCase().replace(/\s+/g, '') as AmenityKey
            const IconComponent = amenityIconMap[amenityKey]?.icon || Info

            return (
              <div key={amenity} className="flex items-center gap-2 ">
                <IconComponent className="h-5 w-5 flex-shrink-0" />
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
                  <p className="mb-4">
                {summary?.ai_summary || "No summary available"}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center justify-center p-4 border rounded-lg min-w-[140px]">
            <div className="text-3xl font-bold">
              {summary?.rating_analysis?.overall_rating || "N/A"}
            </div>
            <div className="flex mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-4 w-4",
                    star <= (summary?.rating_analysis?.overall_rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200"
                  )}
                />
              ))}
            </div>
            <div className="text-sm font-medium">AI Rating</div>
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
                    <div className="text-sm">Positive</div>
                    <div className="mt-2 text-xs">
                  Based on {summary?.sentiment_analysis?.positive?.reviews ?? "0"} reviews
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-yellow-500 font-bold text-xl mb-2">
                  {summary?.sentiment_analysis?.neutral?.percentage ?? "0"}%
                </div>
                    <div className="text-sm">Neutral</div>
                    <div className="mt-2 text-xs">
                  Based on {summary?.sentiment_analysis?.neutral?.reviews ?? "0"} reviews
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-red-500 font-bold text-xl mb-2">
                  {summary?.sentiment_analysis?.negative?.percentage ?? "0"}%
                </div>
                    <div className="text-sm">Negative</div>
                    <div className="mt-2 text-xs">
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
                      <p>No frequently mentioned words found</p>
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
        {session.status === "authenticated" &&
          <AddNewReview businessId={business?.id} />
        }
      </div>

      {/* Individual Reviews */}
      <div className="space-y-8 mb-8">
        <h2 className="text-2xl font-semibold">Recent Reviews</h2>
        {business?.reviews?.length === 0 && <p>No reviews yet!</p>}
        <ListReviews reviews={business?.reviews} />
      </div>

      {/* Map Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Location</h2>
        <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
          <div dangerouslySetInnerHTML={{ __html: business?.googleMapsUrl }} className="w-full" />
        </div>
        <p className="mt-3 text-sm">
          Located in a quiet neighborhood in Lalitpur, just a short walk from Patan Durbar Square. The area is known for
          its traditional architecture and cultural attractions.
        </p>
      </div>

      {/* Owner Details */}
      <OwnerInfoCard owner={business?.owner} establishedYear={business?.establishedYear} />
    </div>
  )
}

