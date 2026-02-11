"use client";

import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlogForm from "./_components/blog-form";
import SavedBlogs from "./_components/saved-blogs";

export default function BlogsPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit") ?? undefined;
  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-background px-6 py-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Create and manage blogs
          </h1>
          <p className="max-w-2xl text-xs text-muted-foreground">
            Draft, publish, and review your saved blogs in one place.
          </p>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-2 h-10 rounded-lg bg-muted p-1">
            <TabsTrigger value="create" className="px-3 text-xs">
              Create Blog
            </TabsTrigger>
            <TabsTrigger value="saved" className="px-3 text-xs">
              Saved Blogs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-0">
            <BlogForm initialBlogId={editId} />
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            <SavedBlogs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
