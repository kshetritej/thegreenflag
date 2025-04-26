import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideChartColumnIncreasing, LucideMessageSquareMore, LucidePencil, LucideTvMinimal } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/prisma/prismaClient";

export default async function BusinessesPage() {
  const session = await getServerSession();
  const user = session?.user;
  const businesses = await prisma.business.findMany({
    where: {
      owner: { email: user?.email }
    },
    include: {
      reviews: true
    }
  })

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Businesses</h1>
        <Button> Add New Business</Button>
      </div>
      <div className="grid gap-4 mt-4">
        {businesses.map(business => (
          <Card key={business.id} className="max-w-2xl">
            <CardHeader className="flex items-center gap-4">
              <Image src={business?.logo || business?.mainImage} alt={business.name} width={100} height={100} className="rounded-full size-24" />
              <div className="flex flex-col gap-2">
                <CardTitle className="flex items-center gap-2">{business.name} <Badge>{business.category}</Badge> </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-2 text-primary">
                  <Button variant={"ghost"} size={"icon"}><LucidePencil /></Button>
                  <Button variant={"ghost"} size={"icon"}><LucideChartColumnIncreasing /></Button>
                  <Link href={`/dashboard/businesses/${business.id}/reviews`}>
                    <Button variant={"ghost"} size={"icon"}><LucideMessageSquareMore /></Button>
                  </Link>
                  <Link href={`/business/${business.id}`}>
                    <Button variant={"ghost"} size={"icon"}><LucideTvMinimal /></Button>
                  </Link>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {business.description.toString().substring(0, 200) + "..."}<Link href={`/business/${business.id}`}> <Button variant={"link"} size={"sm"}>See More</Button></Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}