import { LucideStar } from "lucide-react";
import Image from "next/image";
import { Business } from "@prisma/client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function BusinessDisplayCardList({ business }: { business: Business }) {
  const router = useRouter();
  return (
    <div className="hover:cursor-pointer flex p-2 gap-2 bg-card rounded-md flex-col justify-between" onClick={() => router.push(`/business/${business.id}`)}>
      <div className="grid grid-cols-3 gap-2">
        <div className="w-24 h-24 border rounded-md overflow-hidden col-span-1">
          <Image src={business.logo || business.images[0]} alt={business.name} width={100} height={100} className="object-cover" />
        </div>
        <div className="ml-4 col-span-2">
          <h3 className="text-lg font-bold">{business.name}</h3>
          <p className="flex gap-1 items-center">
            <LucideStar className="size-4 text-yellow-400 fill-yellow-400" />
            {/* @ts-expect-error it exists */}
            <span className="text-sm font-medium">{(business?.reviews?.reduce((acc, review) => acc + review.rating, 0) / business?.reviews?.length || 0).toFixed(1)}</span>
          </p>
        </div>
      </div>
      <div className="flex gap-1">
        <Button variant={'link'} className="px-0 pl-2" onClick={() => router.push(`/business/${business.id}/jobs`)}>Jobs</Button>
        <Button variant={'link'} className="px-0 pl-2" onClick={() => router.push(`/business/${business.id}/events`)}>Events</Button>
      </div>
    </div>
  )
}