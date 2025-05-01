import Image from "next/image"
import { Business } from "@prisma/client"

export default function BusinessImages({ business }: { business: Business }) {
  return (
  <div className="relative mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 rounded-lg overflow-hidden">
          <div className="col-span-2 relative aspect-[4/3]">
            {business &&
            <Image
              src={business?.mainImage}
              alt={business?.name}
              fill
              className="object-cover"
            />
            }
          </div>
          <div className="hidden md:grid grid-rows-2 gap-2">
            <div className="relative">
              {
                business && 
              <Image
                src={business?.images[0]}
                alt={business?.name}
                fill
                className="object-cover"
              />
              }
            </div>
            <div className="relative">
              {
                business &&
                <Image src={business?.images[1] ?? business?.mainImage}
                alt={business?.name}
                fill
                className="object-cover"
              />
              }
            </div>
          </div>
        </div>
      </div>
  )
}