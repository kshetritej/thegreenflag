import Image from "next/image"
import { Business } from "@prisma/client"
import { Button } from "../ui/button"
import { LucideImages } from "lucide-react"
import MyToolTip from "../atoms/MyTooltip"
import { useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"


export default function BusinessImages({ business }: { business: Business }) {
  const [open, setOpen] = useState(false)
  return (
  <div className="relative mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 rounded-lg overflow-hidden">
          <div className="col-span-2 relative aspect-[4/3]">
            {business &&
            <Image
              src={business?.images[0]}
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
                business.images.length > 1 &&
                business.images.slice(1).map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={business?.name}
                    fill
                    className="object-cover"
                  />
                ))
              }
            </div>
            <MyToolTip content={`${business.images?.length} images`}>
              <Button size={'icon'} variant="outline" className="absolute bottom-1 right-1 bg-green-500 hover:bg-green-600" onClick={() => setOpen(true)}>
                <LucideImages className="size-4" />
              </Button>
            </MyToolTip>
          {
            open &&
            <ImageModal business={business} open={open} onOpenChange={setOpen} />
          }
        </div>
      </div>
    </div>
  )
}

function ImageModal({ business, open, onOpenChange }: { business: Business, open: boolean, onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl w-full h-[98vh] bg-card  overflow-auto">
        <DialogHeader>
          <DialogTitle>All Images</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-8">
          {business.images?.map((image) => (
            <img
              src={image}
              alt={business.name}
              key={image}
              height={100}
              className="w-full rounded-xl"
              onClick={() => window.open(image)}
            />
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>

    </Dialog>
  )
}