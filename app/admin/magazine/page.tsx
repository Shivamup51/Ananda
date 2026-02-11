"use client";

import { useSearchParams } from "next/navigation";
import MagzineTabs from "./_components/magzine-tabs";

export default function MagzinePage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit") ?? undefined;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-background px-6 py-6">
      <div className="mx-auto w-full">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Create and manage issues
          </h1>
          <p className="max-w-2xl text-xs text-muted-foreground">
            Store issue metadata, cover, and flipbook links.
          </p>
        </div>

        <MagzineTabs editId={editId} />
      </div>
    </div>
  );
}
