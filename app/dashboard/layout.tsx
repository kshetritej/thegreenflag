"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {  usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = usePathname()
  const session = useSession()
  const router = useRouter()
  if(!session) {
    router.push("/")
  }

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex p-4 bg-sidebar items-center gap-2">
            <SidebarTrigger />
            {location.split("/").map((p, index) => {
              return (
                <div className="flex gap-4" key={index}>
                  <Breadcrumb className="flex list-none items-center">
                    <BreadcrumbItem className="list-none">{p.charAt(0).toUpperCase() + p.slice(1)} </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                  </Breadcrumb>
                </div>
              )
            })}
          </div>
          <div className="p-4">
          {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}