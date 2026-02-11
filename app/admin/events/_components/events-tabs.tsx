"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventForm from "./event-form";
import SavedEvents from "./saved-events";

export default function EventsTabs({ editId }: { editId?: string }) {
  return (
    <Tabs defaultValue="create" className="w-full">
      <TabsList className="mb-4 grid w-full grid-cols-2 h-10 rounded-lg bg-muted p-1">
        <TabsTrigger value="create" className="px-3 text-xs">
          Create Event
        </TabsTrigger>
        <TabsTrigger value="saved" className="px-3 text-xs">
          Saved Events
        </TabsTrigger>
      </TabsList>

      <TabsContent value="create" className="mt-0">
        <EventForm initialId={editId} />
      </TabsContent>
      <TabsContent value="saved" className="mt-0">
        <SavedEvents />
      </TabsContent>
    </Tabs>
  );
}
