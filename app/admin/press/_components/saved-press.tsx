"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { deletePressItem } from "../action";

type PressRow = {
  id: string;
  title: string;
  source?: string | null;
  publishedAt?: string | null;
  isEnabled: boolean;
};

export default function SavedPress() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<PressRow[]>([]);

  const url = useMemo(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    return `/api/press?${params.toString()}`;
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(url)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Failed to load press items.");
        }
        return data?.data as PressRow[];
      })
      .then((rows) => {
        if (cancelled) return;
        setItems(Array.isArray(rows) ? rows : []);
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
          placeholder="Search press..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="hidden md:grid grid-cols-12 text-xs font-semibold text-muted-foreground px-4">
        <div className="col-span-4">Title</div>
        <div className="col-span-3">Source</div>
        <div className="col-span-2">Published</div>
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
        ) : items.length ? (
          items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 items-center px-4 py-3 text-sm hover:bg-muted/40 transition"
            >
              <div className="col-span-4 font-medium truncate">
                {item.title}
              </div>

              <div className="col-span-3 text-muted-foreground truncate">
                {item.source || "-"}
              </div>

              <div className="col-span-2 text-muted-foreground">
                {item.publishedAt
                  ? new Date(item.publishedAt).toLocaleDateString()
                  : "-"}
              </div>

              <div className="col-span-2">
                <Badge variant={item.isEnabled ? "default" : "secondary"}>
                  {item.isEnabled ? "ENABLED" : "DISABLED"}
                </Badge>
              </div>

              <div className="col-span-1 flex justify-end gap-2">
                <Button asChild size="sm" variant="outline">
                  <a href={`/admin/press?edit=${item.id}`}>Edit</a>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={deletingId === item.id}
                  onClick={async () => {
                    if (!window.confirm("Delete this press item?")) return;
                    setDeletingId(item.id);
                    setError(null);
                    try {
                      await deletePressItem(item.id);
                      setItems((prev) => prev.filter((row) => row.id !== item.id));
                    } catch (e) {
                      setError(e instanceof Error ? e.message : "Failed to delete press item.");
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
            No press items found.
          </div>
        )}
      </div>
    </div>
  );
}
