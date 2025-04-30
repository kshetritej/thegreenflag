"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import { EventForm } from "../../event-form";
import { toast } from "sonner";

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

export default function EditEventPage() {
  const { data: session } = useSession();
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const user = session.user as SessionUser;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        toast.error("Failed to load event");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [params.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Event</h1>
      <EventForm
        // @ts-expect-error something fishy here will fix later this is not our concern now.
        initialData={{
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
        }}
        businessId={user.id}
      />
    </div>
  );
} 