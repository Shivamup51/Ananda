"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PressForm from "./press-form";
import SavedPress from "./saved-press";

export default function PressTabs({ editId }: { editId?: string }) {
  return (
    <Tabs defaultValue="create" className="w-full">
      <TabsList className="mb-4 grid w-full grid-cols-2 h-10 rounded-lg bg-muted p-1">
        <TabsTrigger value="create" className="px-3 text-xs">
          Create Press
        </TabsTrigger>
        <TabsTrigger value="saved" className="px-3 text-xs">
          Saved Press
        </TabsTrigger>
      </TabsList>

      <TabsContent value="create" className="mt-0">
        <PressForm initialId={editId} />
      </TabsContent>
      <TabsContent value="saved" className="mt-0">
        <SavedPress />
      </TabsContent>
    </Tabs>
  );
}
