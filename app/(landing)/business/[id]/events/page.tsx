"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { ArrowLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from "next/link"
import NoEvent from "@/components/molecules/no-events"

export default function BusinessEventsPage() {
  const router = useRouter()
  const { id } = useParams()
  const { data: events } = useQuery({
    queryKey: ["business-events"],
    queryFn: async () => {
      const response = await fetch(`/api/business/${id}/events`)
      return response.json()
    }
  })

  return (
    <div className="container mx-auto min-h-[80vh] py-8">
      <Breadcrumb className="flex items-center gap-2 mb-8">
        <BreadcrumbItem>
          <Link href={`/business/${id}`}>
            {id}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="list-none" />
        <BreadcrumbItem>
          <Link href={`/business/${id}/events`}>
            Events
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>

      {events?.length == 0 && <NoEvent/>}
      {/* <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event: any) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow" onClick={() => router.push(`/business/${id}/events/${event.id}`)}>
            <CardHeader>
              <CardTitle className="text-xl">{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {event.description && (
                <p className="text-muted-foreground mb-4">{event.description}</p>
              )}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Start:</span>
                  <span>{format(new Date(event.startDate), "PPP p")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">End:</span>
                  <span>{format(new Date(event.endDate), "PPP p")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}