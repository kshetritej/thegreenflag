"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "../ui/badge"
import { navLinks } from "../common/navbar"
import Link from "next/link"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12">
      <div className="w-full max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          Discover the Local&apos;s
          <br />
          top experiences
        </h1>

        <p className="text-lg  max-w-2xl mx-auto font-[var(--font-geist-mono)]">
          Explore reviews from real people about the best places
          <br />
          ready for your next adventure
        </p>

        <div className="mt-8 w-full max-w-2xl mx-auto">
          <div className="relative flex items-center flex-col">
            <input
              type="text"
              placeholder="What are you looking for?"
              className=" w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  router.push(`/business/explore?search=${searchQuery}`)
                }
              }}
            />

            <Button size={"default"} className="absolute right-0 rounded-full h-[50px]  w-[150px]" onClick={() => router.push(`/business/explore?search=${searchQuery}`)}>
              <Search className="h-5 w-5" /> Search 
            </Button>
          </div>
        </div>
        <div className="flex md:hidden gap-2 justify-center">
          {navLinks.map((item) => {
            return (
              <Link href={item.href} key={item.href} className="font-medium">
                <Button variant={'default'}>
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </div>

        <div className="mt-6 flex flex-wrap justify-center items-center gap-2">
          <span className="text-sm  mr-2 mt-1">Trending searches:</span>
          {["restaurants", "parks", "cafe", "home services", "hotels", "coffee shops"].map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="rounded-full text-sm px-4 py-1 h-auto hover:cursor-pointer"
              onClick={() => router.push(`/business/explore?search=${tag}`)}
            >
              {tag}
            </Badge>
          ))}
        </div>

      {/* <SimpleFilterBar isHomepage={true} /> */}
      </div>
    </div>
  )
}

