"use client";

import { EventForm } from "../event-form";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function NewEventPage() {
  const { data: session } = useSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
      <EventForm />
    </div>
  );
} 