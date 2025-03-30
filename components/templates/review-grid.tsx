import Link from "next/link"
import ReviewCard from "../molecules/display-card"
import SimpleFilterBar from "../molecules/simple-filter-bar"
import prisma from "@/prisma/prismaClient"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Business } from "@prisma/client"

export default function ReviewGrid() {
  const { data: businesses } = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      const response = await axios.get("/api/business")
      return response.data
    },
  })

  console.log("businesses", businesses)

  return (
    <>
      <SimpleFilterBar />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {
          businesses?.map((business: Business) => (
            <Link key={business.id} href={"/review"}>
              <ReviewCard {...business} />
            </Link>
          ))
        }
      </div>
    </>
  )
}

