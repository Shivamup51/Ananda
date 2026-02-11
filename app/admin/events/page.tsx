"use client";

import { useEffect, useState } from "react";
import EventsTabs from "./_components/events-tabs";

export default function EventsPage() {
  const [editId, setEditId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEditId(params.get("edit") ?? undefined);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-background px-6 py-6">
      <div className="mx-auto w-full">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Create and manage events
          </h1>
          <p className="max-w-2xl text-xs text-muted-foreground">
            Schedule, publish, and keep event metadata consistent.
          </p>
        </div>

        <EventsTabs editId={editId} />
      </div>
    </div>
  );
}
