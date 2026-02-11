"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { createPressItem, updatePressItem } from "../action";
import Uploader from "@/components/uploader";
import { pressInputSchema } from "@/lib/zodSchema";

export default function PressForm({ initialId }: { initialId?: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [id, setId] = useState(initialId ?? "");
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [link, setLink] = useState("");
  const [logo, setLogo] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!initialId) return;
    fetch(`/api/press/${initialId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok)
          throw new Error(data?.error || "Failed to load press item.");
        return data?.data;
      })
      .then((item) => {
        if (cancelled || !item) return;
        setId(item.id);
        setTitle(item.title ?? "");
        setSource(item.source ?? "");
        setLink(item.link ?? "");
        setLogo(item.logo ?? "");
        setPublishedAt(
          item.publishedAt
            ? new Date(item.publishedAt).toISOString().slice(0, 10)
            : "",
        );
        setIsEnabled(item.isEnabled ?? true);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load.");
      });
    return () => {
      cancelled = true;
    };
  }, [initialId]);

  function submit() {
    setError(null);
    setSuccess(null);
    const validation = pressInputSchema.safeParse({
      title: title.trim(),
      source: source.trim(),
      link,
      logo,
      publishedAt: publishedAt.trim(),
      isEnabled,
    });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? "Invalid form data.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          ...validation.data,
          source: validation.data.source || null,
          link: validation.data.link || null,
          logo: validation.data.logo || null,
          publishedAt: validation.data.publishedAt || null,
        };
        const saved = id
          ? await updatePressItem(id, payload)
          : await createPressItem(payload);
        setId(saved.id);
        setSuccess(id ? "Press item updated." : "Press item created.");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  }

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-xl">Add a press item</CardTitle>
            <CardDescription>
              Track coverage, mentions, and media.
            </CardDescription>
          </div>
          {id && <Badge variant="secondary">Editing</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Press mention title"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Source</Label>
            <Input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Publication / channel"
            />
          </div>
          <div className="space-y-2">
            <Label>Published date</Label>
            <Input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Link</Label>
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label>Logo</Label>
            <Uploader value={logo} onChange={setLogo} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-dashed bg-muted/30 p-4">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Enabled</Label>
            <p className="text-xs text-muted-foreground">
              Visible in admin & API.
            </p>
          </div>
          <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
        </div>

        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
        {success && (
          <p className="text-sm font-medium text-primary">{success}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <Button onClick={submit} disabled={isPending} className="w-full">
            {isPending ? "Saving..." : id ? "Update Item" : "Create Item"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
