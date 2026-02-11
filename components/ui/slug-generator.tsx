"use client";

import slug from "slug";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

type Props = {
  source: string;
  onGenerate: (value: string) => void;
};

export function SlugGeneratorButton({ source, onGenerate }: Props) {
  function handleGenerate() {
    if (!source.trim()) return;

    const generated = slug(source, {
      lower: true, // lowercase
      trim: true, // remove leading/trailing separators
    });

    onGenerate(generated);
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      className="h-8 px-2 text-xs gap-1"
      onClick={handleGenerate}
    >
      <Wand2 className="h-3.5 w-3.5" />
      Generate
    </Button>
  );
}
