import prisma from "@/prisma/prismaClient"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LucideBuilding2, LucideMail, LucidePhone, LucideRocket, LucideStar, LucideTrello, LucideUser } from "lucide-react"
import ReviewCard from "../molecules/business-display-card"
import Link from "next/link"

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
    <Card className="border-none container mx-auto h-screen p-8 my-8">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-3xl font-bold">Profile</CardTitle>
        <Link href={"/dashboard/overview"}>
        <Button size={"default"}><LucideTrello/> Manage Businesses</Button>
        </Link>
      </CardHeader>
      <CardContent className="flex justify-between items-start gap-4">
        <div className="flex  items-start gap-4 space-y-4 border p-4 rounded-lg bg-foreground/10 dark:bg-background/20">
          <div className="size-20 rounded-full overflow-hidden">
            {user?.profileImage && 
            <Image src={user?.profileImage} alt="Profile Image" width={100} height={100} className="object-cover" />
            }
            {!user?.profileImage && 
              <div className="size-20 rounded-full overflow-hidden  flex items-center justify-center">
              <LucideUser className="size-10" />
            </div>
            }
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <div className="flex gap-2 items-center">
              {user && <>
                <p>@{user?.username}</p> <div className="w-1 h-1 bg-gray-400 rounded-full" /> <p>Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" })}</p>
              </>}
            </div>
            <p>{user?.bio}</p>
            <p>{user?.phone}</p>
            <p>{user?.email}</p>
          </div>
        </div>

        {/* Counts */}
        <div className="flex gap-2">
          <Card className="p-4 flex flex-col gap-2 items-center justify-center">
            <LucideRocket className="size-6" />
            <h3 className="text-xl font-bold">My Space</h3>
            <p>{businesses.length}</p>
          </Card>
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
          <Card className="p-4 flex flex-col gap-2 items-center justify-center">
            <LucideStar className="size-6" />
            <h3 className="text-xl font-bold">Self Reviews</h3>
            <p>{businesses.reduce((acc, business) => acc + business.reviews.length, 0)}</p>
          </Card>

        </div>
      </CardContent>

      {/* list of businesses */}
      <CardFooter className="flex flex-col items-start gap-4">
        <CardTitle className="text-2xl font-bold">My Businesses</CardTitle>
        <CardContent className="grid grid-cols-4 gap-4">
          {businesses.map((business) => (
            // @ts-expect-error it is assignable
            <ReviewCard myBusiness={true} key={business.id} business={business} />
          ))}
        </CardContent>
      </CardFooter>

    </Card>
  )
}