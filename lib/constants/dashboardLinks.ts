import {
  Briefcase,
  Building,
  CalendarClock,
  HandCoins,
  LayoutDashboard,
  Rocket,
  Settings2,
} from "lucide-react"

export const dashboardLinks = {
  navMain: [
    {
      title: "Overview",
      url: "/dashboard/overview",
      icon: LayoutDashboard
    },
    {
      title: "Businesses",
      url: "/dashboard/businesses",
      icon: Building
    },
    {
      title: "Jobs",
      url: "/dashboard/jobs",
      icon: Briefcase,
    },
    {
      title: "Tips and Earnings",
      url: "/dashboard/tips-and-earnings",
      icon: HandCoins
    },
    {
      title: "Space",
      url: "/dashboard/space",
      icon: Rocket
    },
    {
      title: "Event Manager",
      url: "/dashboard/events",
      icon: CalendarClock
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2
    }
  ],
}