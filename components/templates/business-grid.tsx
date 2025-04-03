import ReviewCard from "../molecules/business-display-card"
import SimpleFilterBar from "../molecules/simple-filter-bar"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Business } from "@prisma/client"
import BusinessDisplayCard from "../molecules/business-display-card"

export default function BusinessGrid() {
  const { data: businesses } = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      const response = await axios.get("/api/business")
      return response.data
    },
  })

  return (
    <>
      <h2 className="text-2xl font-bold px-6">Recommendations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {
          (businesses)?.map((business: Business) => (
            <BusinessDisplayCard key={business.id} business={business} />
          ))
        }
      </div>
    </>
  )
}

