import { Card, CardContent , CardHeader, CardTitle } from "@/components/ui/card"
import { Building, DollarSign, Eye, LucideIcon, Star } from "lucide-react"
import { getServerSession } from "next-auth"
import prisma from "@/prisma/prismaClient"

export default async function OverviewPage() {
  const session = await getServerSession()
  const user = session?.user
  const totalReviews = await prisma.review.count({
    where: {
      business: {
        //@ts-expect-error email exists
        owner: { email: user?.email }
      }
    }
  })

  const totalBusinesses = await prisma.business.count({
    where: {
        //@ts-expect-error email exists
      owner: { email: user?.email }
    }
  })

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard title="Total Businesses" icon={Building} statNumber={totalBusinesses.toString()} />
      <StatCard title="Total Reviews" icon={Star} statNumber={totalReviews.toString()} />
      <StatCard title="Revenue" icon={DollarSign} statNumber="$123,456" />
      <StatCard title="Business Views" icon={Eye} statNumber="123,456" />
    </div>
  )
}


type StatsCardProps = {
  title: string,
  icon: LucideIcon,
  statNumber: string
}
function StatCard({ title, icon: Icon, statNumber }: StatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 justify-between items-center">{title}<Icon /></CardTitle>
      </CardHeader>
      <CardContent className="font-bold text-3xl">
        {statNumber}
      </CardContent>
    </Card>
  )
}