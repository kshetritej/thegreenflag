import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideChartColumnIncreasing, LucideMessageSquareMore, LucidePencil, LucideTvMinimal, LucideTrash2 } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/prisma/prismaClient";
import { redirect } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DeleteBusinessButton } from "./delete-business-button";

export default async function BusinessesPage() {
  const session = await getServerSession();
  if(!session) {
    redirect("/")
  }
  const user = session?.user;
  const businesses = await prisma.business.findMany({
    where: {
      // @ts-expect-error email exists
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
        <Link href={"/business"}>
        <Button> Add New Business</Button>
        </Link>
      </div>
      <div className="grid gap-2 mt-4">
        {businesses.map(business => (
          <Card key={business.id} className="">
            <CardHeader className="flex items-center gap-4">
              <Image src={business?.logo || business?.images[0]} alt={business.name} width={100} height={100} className="rounded-full size-24" />
              <div className="flex flex-col gap-2">
                <CardTitle className="flex items-center gap-2">{business.name} <Badge>{business.category}</Badge> </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-2 text-primary">
                  <Link href={`/dashboard/businesses/${business.id}/edit`}>
                    <Button variant={"ghost"} size={"icon"}><LucidePencil /></Button>
                  </Link>
                  <Link href={`/dashboard/businesses/${business.id}/reviews`}>
                    <Button variant={"ghost"} size={"icon"}><LucideMessageSquareMore /></Button>
                  </Link>
                  <Link href={`/business/${business.id}`}>
                    <Button variant={"ghost"} size={"icon"}><LucideTvMinimal /></Button>
                  </Link>
                  <DeleteBusinessButton businessId={business.id} />
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {business.description.toString().substring(0, 150) + "..."}<Link href={`/business/${business.id}`}> <Button variant={"link"} size={"sm"}>See More</Button></Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}