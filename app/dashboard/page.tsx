import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Calendar, DollarSign, Eye, LucideIcon, Star, Briefcase } from "lucide-react"
import { getServerSession } from "next-auth"
import prisma from "@/prisma/prismaClient"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Business, Event, Review } from "@prisma/client"
import DashboardCharts from "./dashboard-charts"

type BusinessWithRelations = Business & {
  reviews: Review[]
  events: Event[]
}

export default async function OverviewPage() {
  const session = await getServerSession()
  const user = session?.user

  // Fetch all stats
  const [totalReviews, totalBusinesses, totalJobs, totalEvents] = await Promise.all([
    prisma.review.count({
      where: {
        business: {
          //@ts-expect-error email exists
          owner: { email: user?.email }
        }
      }
    }),
    prisma.business.count({
      where: {
        //@ts-expect-error email exists
        owner: { email: user?.email }
      }
    }),
    prisma.job.count({
      where: {
        business: {
          //@ts-expect-error email exists
          owner: { email: user?.email }
        }
      }
    }),
    prisma.event.count({
      where: {
        business: {
          //@ts-expect-error email exists
          owner: { email: user?.email }
        }
      }
    })
  ])

  // Fetch data for charts
  const businesses = await prisma.business.findMany({
    where: {
      //@ts-expect-error email exists
      owner: { email: user?.email }
    },
    include: {
      reviews: true,
      events: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  }) as BusinessWithRelations[]

  // Prepare data for business growth chart
  const businessGrowthData = businesses.map(business => ({
    date: new Date(business.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    businesses: 1
  })).reduce((acc, curr) => {
    const existing = acc.find(item => item.date === curr.date)
    if (existing) {
      existing.businesses += 1
    } else {
      acc.push(curr)
    }
    return acc
  }, [] as { date: string; businesses: number }[])

  // Prepare data for review distribution
  const reviewDistribution = businesses.reduce((acc, business) => {
    business.reviews.forEach(review => {
      const rating = review.rating
      acc[rating] = (acc[rating] || 0) + 1
    })
    return acc
  }, {} as Record<number, number>)

  const reviewData = Object.entries(reviewDistribution).map(([rating, count]) => ({
    rating: `${rating} Stars`,
    count
  }))

  // Prepare data for upcoming events
  const upcomingEvents = businesses.flatMap(business =>
    business.events
      .filter(event => new Date(event.startDate) > new Date())
      .map(event => ({
        title: event.title,
        date: new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        business: business.name
      }))
  ).slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Businesses" icon={Building} statNumber={totalBusinesses.toString()} />
        <StatCard title="Total Reviews" icon={Star} statNumber={totalReviews.toString()} />
        <StatCard title="Active Jobs" icon={Briefcase} statNumber={totalJobs.toString()} />
        <StatCard title="Upcoming Events" icon={Calendar} statNumber={totalEvents.toString()} />
      </div>

      <DashboardCharts
        businessGrowthData={businessGrowthData}
        reviewData={reviewData}
        upcomingEvents={upcomingEvents}
      />
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