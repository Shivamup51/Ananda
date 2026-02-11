"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MagazineForm from "./magazine-form";
import SavedIssues from "./saved-issues";

export default function MagzineTabs({ editId }: { editId?: string }) {
  return (
    <Tabs defaultValue="create" className="w-full">
      <TabsList className="mb-4 grid w-full grid-cols-2 h-10 rounded-lg bg-muted p-1">
        <TabsTrigger value="create" className="px-3 text-xs">
          Create Issue
        </TabsTrigger>
        <TabsTrigger value="saved" className="px-3 text-xs">
          Saved Issues
        </TabsTrigger>
      </TabsList>

      <TabsContent value="create" className="mt-0">
        <MagazineForm initialId={editId} />
      </TabsContent>
      <TabsContent value="saved" className="mt-0">
        <SavedIssues />
      </TabsContent>
    </Tabs>
  );
}
