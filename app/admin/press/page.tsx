"use client";

import { useSearchParams } from "next/navigation";
import PressTabs from "./_components/press-tabs";

export default function PressPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit") ?? undefined;

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-background px-6 py-8">
      <div className="w-full space-y-6">
        {/* HEADER */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Press and media items
          </h1>
          <p className="max-w-2xl text-xs text-muted-foreground">
            Track mentions with clean sources and links.
          </p>
        </div>

        {/* TABS AREA */}
        <div className="w-full">
          <PressTabs editId={editId} />
        </div>
      </div>
    </div>
  );
}
