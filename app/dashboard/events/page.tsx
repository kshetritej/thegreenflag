"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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

  const user = session?.user as SessionUser;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/events?userId=${user.id}`);
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [user?.id, router]);

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
    return <div className="container mx-auto h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button onClick={() => router.push("/dashboard/events/new")}>
          Add New Event
        </Button>
      </div>

      <div className="rounded-md border p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">Title</TableHead>
              <TableHead className="w-[30%]">Description</TableHead>
              <TableHead className="w-[20%]">Start Date</TableHead>
              <TableHead className="w-[20%]">End Date</TableHead>
              <TableHead className="w-[10%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  <Card className="p-4 h-40 flex items-center justify-center max-w-md mx-auto">
                    <p className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
                        <LucideCalendar className="size-6" />
                      </div>
                      No events to show. <br /> Click "Add New Event" to create your first event.
                    </p>
                  </Card>
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="max-w-[20%] break-words whitespace-normal">{event.title}</TableCell>
                  <TableCell className="max-w-[30%] break-words whitespace-normal overflow-hidden">
                    <div className="line-clamp-3">{event.description}</div>
                  </TableCell>
                  <TableCell className="max-w-[20%] break-words whitespace-normal">
                    {format(new Date(event.startDate), "PPP p")}
                  </TableCell>
                  <TableCell className="max-w-[20%] break-words whitespace-normal">
                    {format(new Date(event.endDate), "PPP p")}
                  </TableCell>
                  <TableCell className="max-w-[10%]">
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