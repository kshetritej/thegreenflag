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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ReviewDetail() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Himalayan Cafe</h1>
      <div className="flex items-center gap-2 text-gray-600 mb-6">
        <span>Lalitpur, Nepal</span>
        <span>•</span>
        <span>Restaurant</span>
        <span>•</span>
        <span>1.2 miles away</span>
      </div>

      {/* Image Gallery Section */}
      <div className="relative mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 rounded-lg overflow-hidden">
          <div className="col-span-2 relative aspect-[4/3]">
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Himalayan Cafe main image"
              fill
              className="object-cover"
            />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-2">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Himalayan Cafe interior"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Himalayan Cafe food"
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
        <h2 className="text-2xl font-semibold mb-4">About Himalayan Cafe</h2>
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg" alt="Owner" />
            <AvatarFallback>RP</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">Owned by Raj Pradhan</div>
            <div className="text-sm text-gray-500">Established 2015 • Verified business</div>
          </div>
        </div>

        <div className="text-gray-700 space-y-4">
          <p>
            Welcome to Himalayan Cafe, where we bring the authentic flavors of Nepal to Lalitpur. Our restaurant offers
            a cozy atmosphere with traditional Nepalese decor and a menu featuring time-honored recipes passed down
            through generations.
          </p>
          <p>
            We take pride in using fresh, locally-sourced ingredients to create our signature dishes, including our
            famous momos (dumplings), thukpa (noodle soup), and a variety of curries and traditional Nepalese
            specialties.
          </p>
          <p>
            Our team is dedicated to providing exceptional service and an unforgettable dining experience. Whether
            you're a local or a visitor, we invite you to join us for a taste of Nepal's rich culinary heritage.
          </p>
        </div>
      </div>

      {/* Amenities Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Wifi className="h-5 w-5 text-gray-600" />
            <span>Free Wi-Fi</span>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-gray-600" />
            <span>Credit Cards Accepted</span>
          </div>
          <div className="flex items-center gap-3">
            <Parking className="h-5 w-5 text-gray-600" />
            <span>Parking Available</span>
          </div>
          <div className="flex items-center gap-3">
            <Utensils className="h-5 w-5 text-gray-600" />
            <span>Vegetarian Options</span>
          </div>
          <div className="flex items-center gap-3">
            <Coffee className="h-5 w-5 text-gray-600" />
            <span>Outdoor Seating</span>
          </div>
          <div className="flex items-center gap-3">
            <Accessibility className="h-5 w-5 text-gray-600" />
            <span>Wheelchair Accessible</span>
          </div>
        </div>

        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="more-amenities">
            <AccordionTrigger>Show more amenities</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span>Open 7 days a week</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-gray-600" />
                  <span>English & Nepali spoken</span>
                </div>
                <div className="flex items-center gap-3">
                  <Utensils className="h-5 w-5 text-gray-600" />
                  <span>Gluten-free options</span>
                </div>
                <div className="flex items-center gap-3">
                  <Coffee className="h-5 w-5 text-gray-600" />
                  <span>Traditional Nepali tea</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Top Rated Section with AI Summary */}
      <div className="mb-8 border rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-3">Top Rated</h2>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Info className="h-4 w-4" />
              <span>AI summary of 246 reviews</span>
            </div>

            <p className="text-gray-700">
              Reviewers consistently praise Himalayan Cafe for its authentic Nepalese cuisine, particularly highlighting
              the momos and thukpa as standout dishes. The staff receives high marks for friendliness and attentiveness,
              while the atmosphere is described as cozy and reminiscent of Nepal. Many guests appreciate the reasonable
              prices and generous portion sizes. The restaurant's cleanliness and attention to detail are also
              frequently mentioned as positives. Overall, customers describe it as a hidden gem that offers an
              exceptional dining experience.
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
      <div className="mb-8 border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">About the Owner</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-3">
              <AvatarImage src="/placeholder.svg" alt="Owner" />
              <AvatarFallback>RP</AvatarFallback>
            </Avatar>
            <h3 className="font-medium text-center">Raj Pradhan</h3>
            <p className="text-sm text-gray-500 text-center">Owner since 2015</p>
          </div>

          <div className="md:w-3/4">
            <p className="text-gray-700 mb-4">
              Born and raised in Kathmandu, Raj moved to Lalitpur in 2010 with a dream of sharing authentic Nepalese
              cuisine with locals and visitors alike. With over 20 years of culinary experience, including training
              under renowned chefs in Nepal and India, Raj opened Himalayan Cafe in 2015.
            </p>
            <p className="text-gray-700 mb-4">
              "My passion is to create a dining experience that transports guests to Nepal through flavors, aromas, and
              atmosphere. Every dish we serve carries a story from my homeland."
            </p>

            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">Response rate: 98%</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">Response time: Within 1 hour</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">Languages: English, Nepali, Hindi</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">Contact: Message through platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

