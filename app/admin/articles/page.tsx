"use client";

import { useEffect, useState } from "react";
import ArticlesTabs from "./_components/articles-tabs";

export default function ArticlesAdminPage() {
  const [editId, setEditId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEditId(params.get("edit") ?? undefined);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-background px-6 py-6">
      <div className=" w-full ">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Create and manage articles
          </h1>
          <p className="max-w-2xl text-xs text-muted-foreground">
            Same workflow as Blogs: create, edit, and review saved articles.
          </p>
        </div>

        <ArticlesTabs initialEditId={editId} />
      </div>
    </div>
  );
}
