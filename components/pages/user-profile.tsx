"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LucideBuilding2, LucideStar, LucideTrello, LucideUser, Store, Heart, Pencil } from "lucide-react"
import ReviewCard from "@/components/molecules/business-display-card"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BusinessDisplayCard from "@/components/molecules/business-display-card"
import { useState } from "react"
import EditProfileForm from "./edit-profile-form"
import { User } from "@prisma/client"

export default function UserProfile({ user, businesses, savedBusinesses }: { user: User, businesses: any[], savedBusinesses: any[] }) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Card className="border-none container mx-auto min-h-screen p-8 my-8">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-3xl font-bold">Profile</CardTitle>
        <Link href={"/dashboard/"}>
          <Button size={"default"}><LucideTrello /> Manage Businesses</Button>
        </Link>
      </CardHeader>
      <CardContent className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-4 space-y-4 border p-4 rounded-lg bg-foreground/10 dark:bg-background/20 w-full">
          {isEditing ? (
            <EditProfileForm user={user} onCancel={() => setIsEditing(false)} />
          ) : (
            <>
              <div className="relative">
                <div className="size-20 rounded-full overflow-hidden">
                  {user?.profileImage &&
                    <Image src={user?.profileImage} alt="Profile Image" width={100} height={100} className="object-cover" />
                  }
                  {!user?.profileImage && 
                      <div className="size-20 rounded-full overflow-hidden flex items-center justify-center">
                        <LucideUser className="size-10" />
                      </div>
                    }
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 bg-background/80 backdrop-blur-sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="size-4" />
                  </Button>
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
            </>
          )}
        </div>

        {/* Counts */}
        <div className="flex gap-2">
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
        <Tabs defaultValue="my-businesses" className="w-full">
          <TabsList className="flex gap-4">
            <TabsTrigger value="my-businesses"><Store /> Businesses</TabsTrigger>
            <TabsTrigger value="saved-businesses"><Heart /> Saved</TabsTrigger>
          </TabsList>
          <TabsContent value="my-businesses">
            <CardContent className="grid grid-cols-4 gap-4 px-0 py-1">
              {businesses.map((business: any) => (
                <BusinessDisplayCard key={business.id} business={business} />
              ))}
            </CardContent>
          </TabsContent>
          <TabsContent value="saved-businesses">
            <CardContent className="grid grid-cols-4 gap-4 px-0 py-1">
              {savedBusinesses.map((business: any) => (
                <ReviewCard key={business.id} business={business} />
              ))}
            </CardContent>
          </TabsContent>
        </Tabs>
      </CardFooter>
    </Card>
  )
}