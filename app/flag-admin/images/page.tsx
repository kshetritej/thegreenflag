import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Flag } from "lucide-react";
import Image from "next/image";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/prismaClient";
import { Business, User } from "@prisma/client";

type BusinessWithOwner = Business & {
  owner: Pick<User, 'name' | 'email'>;
};

type BusinessImage = {
  id: string;
  url: string;
  business: string;
  owner: Pick<User, 'name' | 'email'> | null;
  isFlagged: boolean;
};

export default async function ImagesPage() {
  const session = await getServerSession();

  // Fetch businesses with their owners
  const businesses = await prisma.business.findMany({
    include: {
      owner: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  }) as BusinessWithOwner[];

  // Transform business images into a flat array
  const allImages: BusinessImage[] = businesses.flatMap((business) =>
    business.images.map((url, index) => ({
      id: `${business.id}-${index}`,
      url,
      business: business.name,
      owner: business.owner,
      isFlagged: false // You might want to add a flagging system later
    }))
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Images</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search images..." className="pl-8" />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={image.url}
                    alt={`Image from ${image.business}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="text-sm font-medium">
                        {image.business}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {image.owner?.email}
                      </p>
                    </div>
                    {image.isFlagged && (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1">
                        <Flag className="h-3 w-3" />
                        Flagged
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 