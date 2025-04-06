"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import { Business } from "@prisma/client"
import { dashboardLinks } from "@/lib/constants/dashboardLinks"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();
  const user = session?.data?.user

  const { data: businesses, isLoading } = useQuery({
    queryFn: async () => await axios.get(`/api/user/${user?.id}/businesses`),
    queryKey: ["user"]
  })

  const teams: {
    name: string
    logo: string,
    category: string
  }[] = businesses?.data?.data.map((bus: Business) => {
    return {
      name: bus.name,
      logo: bus.mainImage,
      category: bus.category
    }
  })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {!isLoading &&
          <TeamSwitcher teams={teams} />
        }
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dashboardLinks.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
