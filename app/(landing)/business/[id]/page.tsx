import BusinessDetail from "@/components/pages/business-detail"
import prisma from "@/prisma/prismaClient"

export default async function BusinessPage({ params }: { params: { id: string } }) {

  const b = await prisma.business.findUnique({
    where: {
      id: params.id,
    },
    include: {
      reviews: {
        include: {
          author: true
        }
      },
      owner: true,
    }
  })

  const business = JSON.parse(JSON.stringify(b))

  return (
    <div>
      <BusinessDetail business={business} />
    </div>
  )
}