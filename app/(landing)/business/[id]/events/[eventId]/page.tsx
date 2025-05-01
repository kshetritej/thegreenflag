"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, Clock, Building2, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function EventDetailPage() {
  const { id, eventId } = useParams()
  const { data: event } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const response = await fetch(`/api/events/${eventId}`)
      return response.json()
    }
  })

  if (event) {
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {event.description && (
                  <div className="prose max-w-none mb-8">
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-muted-foreground">
                        {format(new Date(event.startDate), "PPP")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Time</p>
                      <p className="text-muted-foreground">
                        {format(new Date(event.startDate), "p")} - {format(new Date(event.endDate), "p")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-muted-foreground">{event?.location || event?.business?.street + ", " + event?.business?.city + ", " + event?.business?.state || event?.business?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Organizer</p>
                      <p className="text-muted-foreground">{event.organizer || event?.business?.name}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Event Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p>{format(new Date(event.createdAt), "PPP")}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p>{format(new Date(event.updatedAt), "PPP")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }
}