import UserProfile from "@/components/pages/user-profile"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import prisma from "@/prisma/prismaClient"

export default async function UserProfilePage() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email
    }
  })

  if (!user) {
    redirect("/login")
  }

  const businesses = await prisma.business.findMany({
    where: {
      owner: { email: session?.user?.email },
    },
    select: {
      id: true,
      mainImage: true,
      images: true,
      name: true,
      category: true,
      street: true,
      city: true,
      reviews: {
        select: {
          rating: true
        }
      }
    }
  })

  const savedBusinesses = await prisma.favorite.findMany({
    where: {
      // @ts-expect-error it is assignable
      userId: session?.user?.id
    },
    include: {
      business: {
        select: {
          id: true,
          mainImage: true,
          images: true,
          name: true,
          category: true,
          street: true,
          city: true,
          reviews: {
            select: {
              rating: true
            }
          }
        }
      },
    }
  })

  const formattedSavedBusinesses = savedBusinesses.map((business) => business.business)

  return (
    <UserProfile user={user} businesses={businesses} savedBusinesses={formattedSavedBusinesses} />
  )
}