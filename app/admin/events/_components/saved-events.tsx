"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteEvent } from "../action";

type EventRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  startDate: string;
  isOnline: boolean;
};

export default function SavedEvents() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);

  const url = useMemo(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    return `/api/events?${params.toString()}`;
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(url)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Failed to load events.");
        }
        return data?.data as EventRow[];
      })
      .then((rows) => {
        if (cancelled) return;
        setEvents(Array.isArray(rows) ? rows : []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Input
          className="max-w-sm"
          placeholder="Search events..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="hidden md:grid grid-cols-12 text-xs font-semibold text-muted-foreground px-4">
        <div className="col-span-4">Title</div>
        <div className="col-span-3">Slug</div>
        <div className="col-span-2">Start Date</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      <div className="divide-y rounded-lg border bg-background">
        {isLoading ? (
          <>
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </>
        ) : events.length ? (
          events.map((event) => (
            <div
              key={event.id}
              className="grid grid-cols-12 items-center px-4 py-3 text-sm hover:bg-muted/40 transition"
            >
              <div className="col-span-4 font-medium truncate">
                {event.title}
              </div>

              <div className="col-span-3 text-muted-foreground truncate">
                {event.slug}
              </div>

              <div className="col-span-2 text-muted-foreground">
                {new Date(event.startDate).toLocaleDateString()}
              </div>

              <div className="col-span-2 flex items-center gap-2">
                <Badge
                  variant={event.status === "PUBLISHED" ? "default" : "secondary"}
                >
                  {event.status}
                </Badge>
              </div>

              <div className="col-span-1 flex justify-end gap-2">
                <Button asChild size="sm" variant="outline">
                  <a href={`/admin/events?edit=${event.id}`}>Edit</a>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={deletingId === event.id}
                  onClick={async () => {
                    if (!window.confirm("Delete this event?")) return;
                    setDeletingId(event.id);
                    setError(null);
                    try {
                      await deleteEvent(event.id);
                      setEvents((prev) => prev.filter((row) => row.id !== event.id));
                    } catch (e) {
                      setError(e instanceof Error ? e.message : "Failed to delete event.");
                    } finally {
                      setDeletingId(null);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No events found.
          </div>
        )}
      </div>
    </div>
  );
}
