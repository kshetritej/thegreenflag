import {
  CalendarClock,
  GalleryVerticalEnd,
  HandCoins,
  LayoutDashboard,
  Rocket,
  Settings2,
  Star,
} from "lucide-react"

export const dashboardLinks = {
  navMain: [
    {
      title: "Overview",
      url: "/dashboard/overview",
      icon: LayoutDashboard
    },
    {
      title: "Media Library",
      url: "/dashboard/manage-media",
      icon: GalleryVerticalEnd
    },
    {
      title: "Reviews",
      url: "/dashboard/reviews",
      icon: Star
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