"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface DashboardChartsProps {
  businessGrowthData: { date: string; businesses: number }[]
  reviewData: { rating: string; count: number }[]
  upcomingEvents: { title: string; date: string; business: string }[]
}

export default function DashboardCharts({
  businessGrowthData,
  reviewData,
  upcomingEvents
}: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Business Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Business Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ businesses: { theme: { light: "hsl(var(--chart-1))", dark: "hsl(var(--chart-1))" } } }}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={businessGrowthData}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="businesses"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Review Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Review Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ count: { theme: { light: "hsl(var(--chart-2))", dark: "hsl(var(--chart-2))" } } }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reviewData}>
                <XAxis dataKey="rating" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Upcoming Events Timeline */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.business}</p>
                </div>
                <div className="text-sm font-medium">{event.date}</div>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <p className="text-center text-muted-foreground">No upcoming events</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 