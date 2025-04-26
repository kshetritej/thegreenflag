import BusinessDetail from "@/components/pages/business-detail"
import prisma from "@/prisma/prismaClient"

export default async function BusinessPage({ params }: { params: { id: string } }) {
  const businessId = await params.id
  const b = await prisma.business.findUnique({
    where: {
      id: businessId,
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

  const business = b as any

  return (
    <div>
      <BusinessDetail business={business} />
    </div>
  )
}