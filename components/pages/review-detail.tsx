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
} from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Business } from "@prisma/client"
import OwnerInfoCard from "@/components/review/owner-info-card"
import { useState, useEffect } from "react"
import axios from "axios"
import AddNewReview from "@/components/review/add-new-review"

export default function ReviewDetail({ business }: { business: Business }) {
  const [summary, setSummary] = useState<string>("")
  useEffect(() => {
    const fetchSummary = async () => {
      const summary = await axios.post(`/api/groq`, {
        prompt: `${JSON.stringify(business)}`
      })
      setSummary(summary.data)
    }
    fetchSummary()
  }, [])

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
      <div>{summary}</div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            {business.amenities.map((amenity) => (
              <div key={amenity} className="flex items-center gap-3">
                {/* <AmenityIcon icon={amenity.icon} className="h-5 w-5 text-gray-600" /> */}
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Rated Section with AI Summary */}
      <div className="mb-8 border rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-3">Top Rated</h2>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Info className="h-4 w-4" />
              {business.reviews.length} reviews
              <span>•</span>
              <span>AI summary of {business.reviews.length} reviews</span>
            </div>

            <p className="text-gray-700">
              {business.reviews.length > 0 &&
                "hello"
                // JSON.parse(summary).ai_summary
              }
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg min-w-[140px]">
            <div className="text-3xl font-bold">4.84</div>
            <div className="flex mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-gray-800 text-gray-800" />
              ))}
            </div>
            <div className="text-sm text-gray-600 font-medium">246 Reviews</div>
          </div>
        </div>
      </div>

      {/* Sentiment Analysis Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Review Sentiment Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="border rounded-lg p-4">
            <div className="text-green-500 font-bold text-xl mb-2">95%</div>
            <div className="text-sm text-gray-600">Positive</div>
            <div className="mt-2 text-xs text-gray-500">Based on 234 reviews</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="text-yellow-500 font-bold text-xl mb-2">3%</div>
            <div className="text-sm text-gray-600">Neutral</div>
            <div className="mt-2 text-xs text-gray-500">Based on 7 reviews</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="text-red-500 font-bold text-xl mb-2">2%</div>
            <div className="text-sm text-gray-600">Negative</div>
            <div className="mt-2 text-xs text-gray-500">Based on 5 reviews</div>
          </div>
        </div>

        <div className="mt-6 border rounded-lg p-4">
          <h3 className="font-medium mb-3">Most Mentioned Topics</h3>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Food quality (187)</Badge>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Service (156)</Badge>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Atmosphere (124)</Badge>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Value (98)</Badge>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Momos (87)</Badge>
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Wait time (12)</Badge>
            <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Parking (5)</Badge>
          </div>
        </div>
      </div>

      {/* Detailed Ratings */}
      <RatingComponent
        overallRating={4.84}
        serviceRating={4.8}
        qualityRating={4.9}
        atmosphereRating={4.9}
        responsiveness={4.9}
        location={4.9}
        value={4.7}
        reviewCount={246}
      />

      <Separator className="my-8" />

      <div className="mb-8">
        <AddNewReview businessId={business.id} />
      </div>

      {/* Individual Reviews */}
      <div className="space-y-8 mb-8">
        <h2 className="text-2xl font-semibold">Recent Reviews</h2>

        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-gray-500">March 2023</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-1">4.9</span>
                <Star className="w-4 h-4 fill-gray-800 text-gray-800" />
              </div>
            </div>

            <p className="text-gray-700 mb-4">
              Absolutely amazing experience! The food was authentic and delicious, and the staff was incredibly
              friendly. The atmosphere transported me right back to Nepal. I especially loved their momos and thukpa.
              Will definitely be coming back again soon!
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

          <div className="border rounded-lg p-6">
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Jane Smith</div>
                  <div className="text-sm text-gray-500">February 2023</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-1">4.7</span>
                <Star className="w-4 h-4 fill-gray-800 text-gray-800" />
              </div>
            </div>

            <p className="text-gray-700 mb-4">
              Great place with authentic Nepalese cuisine. The service was excellent and the ambiance was perfect for a
              casual dinner with friends. Prices are reasonable for the quality and portion sizes. The chai tea was
              exceptional!
            </p>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <ThumbsUp className="w-4 h-4" />
                Helpful (18)
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

          <Button variant="outline" className="w-full py-2">
            Show all 246 reviews
          </Button>
        </div>
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

