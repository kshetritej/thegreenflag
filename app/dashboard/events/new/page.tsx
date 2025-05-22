"use client";

import { EventForm } from "../event-form";

export default function NewEventPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
      <EventForm />
    </div>
  );
} 