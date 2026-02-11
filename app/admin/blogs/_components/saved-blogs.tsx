"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteBlog } from "../action";

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  updatedAt: string;
  excerpt?: string | null;
};

export default function SavedBlogs() {
  const session = authClient.useSession();
  const userId = session.data?.user?.id;

  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<BlogRow[]>([]);

  const url = useMemo(() => {
    const params = new URLSearchParams();
    if (userId) params.set("authorId", userId);
    if (query.trim()) params.set("q", query.trim());
    return `/api/blogs?${params.toString()}`;
  }, [query, userId]);

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);

    fetch(url)
      .then((res) => res.json())
      .then((data) => setBlogs(data.data || []))
      .catch(() => setError("Failed to load blogs."))
      .finally(() => setIsLoading(false));
  }, [url, userId]);

  if (!userId) {
    return (
      <p className="text-sm text-muted-foreground">Sign in to view blogs.</p>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER STRIP */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Saved Blogs</h2>
          <p className="text-xs text-muted-foreground">
            Manage, edit, and review your blog posts.
          </p>
        </div>
        <Input
          className="max-w-sm"
          placeholder="Search blogs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* TABLE HEADER */}
      <div className="hidden md:grid grid-cols-12 text-xs font-semibold text-muted-foreground px-4">
        <div className="col-span-4">Title</div>
        <div className="col-span-3">Slug</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Updated</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* LIST BODY */}
      <div className="divide-y rounded-xl border bg-background">
        {isLoading ? (
          <>
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </>
        ) : blogs.length ? (
          blogs.map((blog) => (
            <div
              key={blog.id}
              className="grid grid-cols-12 items-center px-4 py-3 text-sm hover:bg-muted/40 transition cursor-pointer"
            >
              <div className="col-span-12 md:col-span-4 font-medium">
                {blog.title}
                <p className="text-xs text-muted-foreground truncate">
                  {blog.excerpt || "No excerpt provided."}
                </p>
              </div>

              <div className="col-span-6 md:col-span-3 text-muted-foreground truncate">
                {blog.slug}
              </div>

              <div className="col-span-3 md:col-span-2">
                <Badge
                  variant={
                    blog.status === "PUBLISHED" ? "default" : "secondary"
                  }
                >
                  {blog.status}
                </Badge>
              </div>

              <div className="col-span-3 md:col-span-2 text-muted-foreground">
                {new Date(blog.updatedAt).toLocaleDateString()}
              </div>

              <div className="col-span-12 md:col-span-1 flex md:justify-end gap-2 mt-2 md:mt-0">
                <Button asChild size="sm" variant="outline">
                  <a href={`/admin/blogs?edit=${blog.id}`}>Edit</a>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={deletingId === blog.id}
                  onClick={async () => {
                    if (!window.confirm("Delete this blog?")) return;
                    setDeletingId(blog.id);
                    setError(null);
                    try {
                      await deleteBlog(blog.id);
                      setBlogs((prev) => prev.filter((row) => row.id !== blog.id));
                    } catch (e) {
                      setError(e instanceof Error ? e.message : "Failed to delete blog.");
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
          <div className="p-8 text-center text-sm text-muted-foreground">
            No blogs found.
          </div>
        )}
      </div>
    </div>
  );
}
