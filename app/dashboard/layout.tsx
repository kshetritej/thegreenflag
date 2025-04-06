"use client";

import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/common/navbar";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex p-4 bg-sidebar">
            {window.location.pathname.split("/").map((p) => {
              return (
                <div className="flex gap-4">
                  <Breadcrumb>
                    <BreadcrumbItem className="list-none">{p.charAt(0).toUpperCase() + p.slice(1)} /</BreadcrumbItem>
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