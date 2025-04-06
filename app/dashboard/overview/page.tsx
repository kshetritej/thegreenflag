import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon, Star } from "lucide-react"

export default function OverviewPage() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard title="Total Reviews" icon={Star} statNumber="233" />
      <StatCard title="Total Reviews" icon={Star} statNumber="233" />
      <StatCard title="Total Reviews" icon={Star} statNumber="233" />
      <StatCard title="Total Reviews" icon={Star} statNumber="233" />
    </div>
  )
}


type StatsCardProps = {
  title: string,
  icon: LucideIcon,
  statNumber: string
}
export function StatCard({ title, icon: Icon, statNumber }: StatsCardProps) {
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