import { LucideStar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BusinessDisplayCardSkeleton() {
  return (
    <div className="hover:cursor-pointer flex p-2 gap-2 bg-card rounded-md flex-col justify-between">
      <div className="grid grid-cols-3 gap-2">
        <div className="w-24 h-24 border rounded-md overflow-hidden col-span-1">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="ml-4 col-span-2 flex flex-col gap-2">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <p className="flex gap-1 items-center">
            <LucideStar className="size-4 text-yellow-400 fill-yellow-400" />
          </p>
        </div>
      </div>
    </div>
  )
}