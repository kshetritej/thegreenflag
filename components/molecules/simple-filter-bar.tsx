"use client"

import { ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"

export default function SimpleFilterBar() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = [
    "All",
    "Restaurants",
    "Hotels",
    "Shopping",
    "Services",
    "Entertainment",
    "Outdoors",
    "Beauty",
    "Auto",
  ]

  return (
    <div className="w-full flex flex-wrap items-center gap-4 py-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 rounded-md border border-gray-200 bg-white text-sm font-medium">
          Recommended
          <ChevronDown className="h-4 w-4 ml-1" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem className="flex items-center gap-2">
            <span className="h-4 w-4 text-primary">✓</span>
            Recommended
          </DropdownMenuItem>
          <DropdownMenuItem>Highest Rated</DropdownMenuItem>
          <DropdownMenuItem>Most Reviewed</DropdownMenuItem>
          <DropdownMenuItem>Nearest</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex flex-wrap items-center gap-2 ml-4">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className={`rounded-full cursor-pointer p-2 min-w-[60px] ${activeCategory === category
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-transparent text-gray-700 hover:text-gray-900"
              }`}
            onClick={() => setActiveCategory(category === activeCategory ? null : category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  )
}

