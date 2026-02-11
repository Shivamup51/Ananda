"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { deleteArticle } from "../action";

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  updatedAt: string;
  standfirst?: string | null;
};

export default function SavedArticles() {
  const session = authClient.useSession();
  const userId = session.data?.user?.id;

  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState<ArticleRow[]>([]);

  const url = useMemo(() => {
    const params = new URLSearchParams();
    if (userId) params.set("authorId", userId);
    if (query.trim()) params.set("q", query.trim());
    return `/api/articles?${params.toString()}`;
  }, [query, userId]);

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => setArticles(data.data || []))
      .catch(() => setError("Failed to load."))
      .finally(() => setIsLoading(false));
  }, [url, userId]);

  if (!userId) {
    return (
      <p className="text-sm text-muted-foreground">Sign in to view articles.</p>
    );
  }

  return (
    <div className="space-y-5">
      {/* SEARCH */}
      <div className="flex items-center justify-between">
        <Input
          className="max-w-sm"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* HEADER */}
      <div className="hidden md:grid grid-cols-12 text-xs font-semibold text-muted-foreground px-4">
        <div className="col-span-4">Title</div>
        <div className="col-span-3">Slug</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Updated</div>
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
        ) : articles.length ? (
          articles.map((article) => (
            <div
              key={article.id}
              className="grid grid-cols-12 items-center px-4 py-3 text-sm hover:bg-muted/40 transition"
            >
              <div className="col-span-4 font-medium truncate">
                {article.title}
                <p className="text-xs text-muted-foreground truncate">
                  {article.standfirst}
                </p>
              </div>

              <div className="col-span-3 text-muted-foreground truncate">
                {article.slug}
              </div>

              <div className="col-span-2">
                <Badge
                  variant={
                    article.status === "PUBLISHED" ? "default" : "secondary"
                  }
                >
                  {article.status}
                </Badge>
              </div>

              <div className="col-span-2 text-muted-foreground">
                {new Date(article.updatedAt).toLocaleDateString()}
              </div>

              <div className="col-span-1 flex justify-end gap-2">
                <Button asChild size="sm" variant="outline">
                  <a href={`/admin/articles?edit=${article.id}`}>Edit</a>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={deletingId === article.id}
                  onClick={async () => {
                    if (!window.confirm("Delete this article?")) return;
                    setDeletingId(article.id);
                    setError(null);
                    try {
                      await deleteArticle(article.id);
                      setArticles((prev) =>
                        prev.filter((row) => row.id !== article.id),
                      );
                    } catch (e) {
                      setError(e instanceof Error ? e.message : "Failed to delete article.");
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
            No articles found.
          </div>
        )}
      </div>
    </div>
  );
}
