import BusinessDetail from "@/components/pages/business-detail"
import prisma from "@/prisma/prismaClient"

type Params = Promise<{ id: string }>
export default async function BusinessPage({ params }: { params: Params }) {
  const businessId = (await params).id
  const b = await prisma.business.findUnique({
    where: {
      id: businessId,
    },
    include: {
      jobs: true,
      reviews: {
        include: {
          replies: true,
          author: true
        }
      },
      owner: true,
    }
  })

  const business = b

  return (
    <div>
      {/* @ts-expect-error type mismatch */}
      <BusinessDetail business={business} />
    </div>
  )
}
