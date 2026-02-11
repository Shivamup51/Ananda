"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArticleForm from "./article-form";
import SavedArticles from "./saved-articles";

export default function ArticlesTabs({
  initialEditId,
}: {
  initialEditId?: string;
}) {
  return (
    <Tabs defaultValue="create" className="w-full">
      {/* 🔥 FULL WIDTH TAB BAR */}
      <TabsList className="mb-4 grid w-full grid-cols-2 h-10 rounded-lg bg-muted p-1">
        <TabsTrigger value="create" className="text-xs">
          Create Article
        </TabsTrigger>
        <TabsTrigger value="saved" className="text-xs">
          Saved Articles
        </TabsTrigger>
      </TabsList>

      {/* FULL WIDTH CONTENT */}
      <TabsContent value="create" className="mt-0 w-full">
        <ArticleForm initialArticleId={initialEditId} />
      </TabsContent>

      <TabsContent value="saved" className="mt-0 w-full">
        <SavedArticles />
      </TabsContent>
    </Tabs>
  );
}
