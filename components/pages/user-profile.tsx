import prisma from "@/prisma/prismaClient"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "../ui/button"
import Link from "next/link"
import { LucideBuilding2, LucideMail, LucidePhone, LucideStar, LucideUser } from "lucide-react"
import ReviewCard from "../molecules/display-card"

export default async function UserProfile() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    redirect("/login")
  }

  const businesses = await prisma.business.findMany({
    where: {
      owner: { email: session?.user?.email },
    },
    select:{
      id: true,
      mainImage: true,
      name: true,
      category: true,
      street: true,
      city: true,
      reviews:{
        select:{
          rating: true
        }
      }
    }
  })

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email
    }
  })

  return (
    <Card className="max-w-3xl mx-auto my-10">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between gap-4">
        <div className="flex items-center gap-4 space-y-4">
          <div className="size-20 rounded-full overflow-hidden">
            {user?.profileImage && 
            <Image src={user?.profileImage} alt="Profile Image" width={100} height={100} className="object-cover" />
            }
            {!user?.profileImage && 
            <div className="size-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              <LucideUser className="size-10" />
            </div>
            }
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <div className="flex gap-2 items-center">
              <p>@{user?.username}</p> <div className="w-1 h-1 bg-gray-400 rounded-full" /> <p>Joined {user?.createdAt.toLocaleDateString()}</p>
            </div>
            <p>{user?.bio}</p>

            <div className="flex gap-4 mt-4">
              <Link href={`tel:${user?.phone}`}>
                <Button><LucidePhone /> Call</Button>
              </Link>
              <Link href={`mailto:${user?.email}`}>
                <Button className="w-full"><LucideMail />  Send Message</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Counts */}
        <div className="flex gap-4">
          <Card className="p-4 flex flex-col gap-2 items-center justify-center">
            <LucideBuilding2 className="size-6" />
            <h3 className="text-xl font-bold">Businesses</h3>
            <p>{businesses.length}</p>
          </Card>
          <Card className="p-4 flex flex-col gap-2 items-center justify-center">
            <LucideStar className="size-6" />
            <h3 className="text-xl font-bold">Reviews</h3>
            <p>{businesses.reduce((acc, business) => acc + business.reviews.length, 0)}</p>
          </Card>
        </div>
      </CardContent>

      {/* list of businesses */}
      <CardFooter className="flex flex-col items-start gap-4">
        <CardTitle>Businesses</CardTitle>
        <CardContent className="flex  gap-4">
          {businesses.map((business) => (
            <ReviewCard myBusiness={true} key={business.id} business={business as any} />
          ))}
        </CardContent>
      </CardFooter>
    </Card>
  )
}