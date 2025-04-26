import BusinessDetail from "@/components/pages/business-detail"
import prisma from "@/prisma/prismaClient"
export default async function GetLuckyPage() {
  const businesses = await prisma.business.findMany({
    include:{
      reviews:{
        include:{
          author: true,
        }
      },
      owner: true,

    }
  })
  const randomBusiness = businesses[Math.floor(Math.random() * businesses.length)]
  console.log(randomBusiness)

  return (
      <BusinessDetail business={randomBusiness} />
  )
}