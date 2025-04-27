import ListReviews from "@/components/review/list-reviews"
import prisma from "@/prisma/prismaClient"

type Params = Promise<{businessId: string}>
export default async function BusinessReviewsPage({ params }: { params: Params }) {
  const reviews = await prisma.review.findMany({
    where: {
      businessId: (await params).businessId
    },
    include: {
      author: true
    }
  })
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Business Reviews</h1>
      {
        reviews.length < 1 &&
        <p> No reviews yet.</p>
      }
      <div className="grid grid-cols-2 gap-2">
        <ListReviews reviews={reviews} dashboard />
      </div>
    </div>
  )
}