"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteMagazineIssue } from "../action";

type IssueRow = {
  id: string;
  title: string;
  slug: string;
  month: number;
  year: number;
  status: string;
  updatedAt?: string;
  coverImage: string;
};

export default function SavedIssues() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState<IssueRow[]>([]);

  const url = useMemo(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    return `/api/magazine-issues?${params.toString()}`;
  }, [query]);

  useEffect(() => {
    setIsLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => setIssues(data.data || []))
      .catch(() => setError("Failed to load issues."))
      .finally(() => setIsLoading(false));
  }, [url]);

  return (
    <div className="space-y-5">
      {/* SEARCH */}
      <div className="flex items-center justify-between">
        <Input
          className="max-w-sm"
          placeholder="Search issues..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* HEADER */}
      <div className="hidden md:grid grid-cols-12 text-xs font-semibold text-muted-foreground px-4">
        <div className="col-span-4">Title</div>
        <div className="col-span-3">Slug</div>
        <div className="col-span-2">Issue Date</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* LIST */}
      <div className="divide-y rounded-lg border bg-background">
        {isLoading ? (
          <>
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </>
        ) : issues.length ? (
          issues.map((issue) => (
            <div
              key={issue.id}
              className="grid grid-cols-12 items-center px-4 py-3 text-sm hover:bg-muted/40 transition"
            >
              <div className="col-span-4 font-medium truncate">
                {issue.title}
              </div>

              <div className="col-span-3 text-muted-foreground truncate">
                {issue.slug}
              </div>

              <div className="col-span-2 text-muted-foreground">
                {issue.month}/{issue.year}
              </div>

              <div className="col-span-2">
                <Badge
                  variant={
                    issue.status === "PUBLISHED" ? "default" : "secondary"
                  }
                >
                  {issue.status}
                </Badge>
              </div>

              <div className="col-span-1 flex justify-end gap-2">
                <Button asChild size="sm" variant="outline">
                  <a href={`/admin/magazine?edit=${issue.id}`}>Edit</a>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <a href={`/admin/flipbook?edit=${issue.id}`}>Flipbook</a>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={deletingId === issue.id}
                  onClick={async () => {
                    if (!window.confirm("Delete this issue?")) return;
                    setDeletingId(issue.id);
                    setError(null);
                    try {
                      await deleteMagazineIssue(issue.id);
                      setIssues((prev) => prev.filter((row) => row.id !== issue.id));
                    } catch (e) {
                      setError(e instanceof Error ? e.message : "Failed to delete issue.");
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
            No issues found.
          </div>
        )}
      </div>
    </div>
  );
}
