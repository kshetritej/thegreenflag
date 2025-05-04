"use client"

import { LucideX, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Category } from "@prisma/client"
import { Button } from "../ui/button"
import { useDebounce } from "@/hooks/use-debounce"
import { Input } from "../ui/input"
import MyToolTip from "../atoms/MyTooltip"

const MAIN_CATEGORIES = Object.values(Category).slice(0, 7)
const OTHER_CATEGORIES = Object.values(Category).slice(7)

export default function SimpleFilterBar({ isHomepage = false }: { isHomepage: boolean }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || null)
  const [showAllCategories, setShowAllCategories] = useState(false)

  const debouncedSearch = useDebounce(searchQuery, 300)

  useEffect(() => {
    if (isHomepage) return

    const params = new URLSearchParams(searchParams)

    if (debouncedSearch) {
      params.set("search", debouncedSearch)
    } else {
      params.delete("search")
    }

    if (activeCategory) {
      params.set("category", activeCategory)
    } else {
      params.delete("category")
    }

    const queryString = params.toString()
    router.push(`/business/explore${queryString ? `?${queryString}` : ""}`)
  }, [debouncedSearch, activeCategory, isHomepage, searchParams, router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) {
      params.set("search", searchQuery)
    }
    if (activeCategory) {
      params.set("category", activeCategory)
    }
    router.push(`/business/explore${params.toString() ? `?${params}` : ""}`)
  }

  const handleCategoryClick = (category: string) => {
    if (isHomepage) {
      router.push(`/business/explore?category=${category}`)
    } else {
      setActiveCategory(category === activeCategory ? null : category)
    }
  }

  const displayedCategories = showAllCategories
    ? [...MAIN_CATEGORIES, ...OTHER_CATEGORIES]
    : MAIN_CATEGORIES

  return (
    <div className="container mx-auto flex flex-col items-center justify-center gap-4 py-4">
      {!isHomepage && (
        <div className="mt-8 w-full mx-auto">
          <div className="relative flex items-center flex-col">
            <input
              id="search-box"
              type="text"
              placeholder="What are you looking for?"
              className=" w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => setSearchQuery(e.target.value)}
              defaultValue={searchQuery}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e)
                }
              }}
            />
            {
              searchQuery.length > 0 &&
              <MyToolTip content="Clear search">
                <Button size={'icon'} className="rounded-full absolute right-28 top-[7px]"
                  variant={'ghost'}
                  onClick={() => {
                    setSearchQuery("")
                    // @ts-expect-error its not empty, i've defined it up in the input field
                    document.getElementById("search-box").value = ""
                  }}
                ><LucideX /></Button>
              </MyToolTip>
            }
            <Button size={"default"} className="absolute right-0 top-0.4 h-[50px] rounded-full" onClick={handleSearch}>
              <Search className="h-5 w-5" /> Search
            </Button>
          </div>
        </div>

      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={activeCategory === null ? "default" : "outline"}
            className={`cursor-pointer p-2 min-w-[60px] ${activeCategory === null
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-transparent"
              }`}
            onClick={() => setActiveCategory(null)}>All</Badge>
          {displayedCategories.map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={`cursor-pointer p-2 min-w-[60px] ${activeCategory === category
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-transparent"
                }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category.replace(/_/g, " ")}
            </Badge>
          ))}

          {MAIN_CATEGORIES.length < Object.values(Category).length && (
            <Badge
              variant="outline"
              className="bg-green-200 border-green-500  text-black cursor-pointer p-2"
              onClick={() => setShowAllCategories(!showAllCategories)}
            >
              {showAllCategories ? "Show Less" : "More..."}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

