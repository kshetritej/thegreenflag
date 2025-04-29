"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { LucideCalendar } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
}

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default function EventsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const user = session.user as SessionUser;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/events?businessId=${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        toast.error("Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [user.id]);

  const handleDelete = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      setEvents(events.filter((event) => event.id !== eventId));
      toast.success("Event deleted successfully");
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button onClick={() => router.push("/dashboard/events/new")}>
          Add New Event
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  <Card className="p-4 h-40 flex items-center justify-center max-w-md mx-auto">
                    <p className="flex flex-col items-center gap-2">
                      <LucideCalendar className="size-4" />
                      No events to show. Click "Add New Event" to create your first event.
                    </p>
                  </Card>
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell>
                    {format(new Date(event.startDate), "PPP p")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(event.endDate), "PPP p")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          router.push(`/dashboard/events/${event.id}/edit`)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(event.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}