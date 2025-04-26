"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import { dashboardLinks } from "@/lib/constants/dashboardLinks"
import Link from "next/link"
import { LandPlot } from "lucide-react"
import { Button } from "./ui/button"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();
  const user = session?.data?.user

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="p-4 ">
        <Button variant={'ghost'}>
          <Link href={"/"} className="flex gap-1 items-center font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <LandPlot className="size-4" />
            </div>
            Green Flag
          </Link>
        </Button>
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
