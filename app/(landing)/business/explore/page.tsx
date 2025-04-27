"use client"

import ReviewCard from "@/components/molecules/business-display-card"
import SimpleFilterBar from "@/components/molecules/simple-filter-bar"
import { Business } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Suspense } from "react"

export default function Expore(){
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[400px]">Loading ...</div>}>
      <ExploreComponent/>
    </Suspense>
  )
}
function ExploreComponent() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const search = searchParams.get("search")

  const { data: businesses, isLoading, isError } = useQuery({
    queryFn: async () => {
      const params = new URLSearchParams()
      if (category) params.append("category", category)
      if (search) params.append("search", search)

      const { data } = await axios.get(`/api/business?${params.toString()}`)
      return data
    },
    queryKey: ["businesses", category, search],
  })

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold ">Something went wrong</h2>
        <p className="">Failed to load businesses. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-2">
      <SimpleFilterBar isHomepage={false} />

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : businesses?.length === 0 ? (
          <div className="h-1/2 flex flex-col items-center justify-center min-h-[400px] text-center">
          <h2 className="text-xl font-semibold ">No businesses found</h2>
          <p className="mt-2">
            {search
              ? `No results found for "${search}"`
              : category
                ? `No businesses found in ${category.toLowerCase().replace(/_/g, " ")}`
                : "No businesses available"}
          </p>
        </div>
      ) : (
            <div className="container h-screen mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {businesses?.map((business: Business) => (
            <div key={business.id}>
              <ReviewCard business={business} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
