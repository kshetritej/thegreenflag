'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface DashboardChartsProps {
  businessGrowthData: any[];
  userGrowthData: any[];
  reviewData: any[];
}

export function DashboardCharts({ businessGrowthData, userGrowthData, reviewData }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
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

      {/* User Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ users: { theme: { light: "hsl(var(--chart-2))", dark: "hsl(var(--chart-2))" } } }}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
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
          <ChartContainer config={{ count: { theme: { light: "hsl(var(--chart-3))", dark: "hsl(var(--chart-3))" } } }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reviewData}>
                <XAxis dataKey="rating" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--chart-3))" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
} 