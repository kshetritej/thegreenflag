import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Business } from "@prisma/client"
import BusinessDisplayCardList from "@/components/molecules/business-display-card-list"
import BusinessDisplayCardSkeleton from "@/components/common/business-display-card-skeleton"  
export default function BusinessGrid() {
  const { data: businesses, isLoading } = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      const response = await axios.get("/api/business")
      return response.data
    },
  })

  return (
    <div className="container px-24 mx-auto">
      <h2 className="text-2xl  px-6">Popular Businesses</h2>
      {isLoading && 
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {Array.from({ length: 8}).map((_, index) => (
            <BusinessDisplayCardSkeleton key={index} />
          ))}
        </div>
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {
          (businesses)?.map((business: Business) => (
            <BusinessDisplayCardList key={business.id} business={business} />
          ))
        }
      </div>
    </div>
  )
}

