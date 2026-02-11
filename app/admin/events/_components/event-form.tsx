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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEvent, updateEvent } from "../action";
import Uploader from "@/components/uploader";
import { SlugGeneratorButton } from "@/components/ui/slug-generator";
import { eventInputSchema } from "@/lib/zodSchema";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";

const defaultDescription = "<p>Start writing your event description here.</p>";

export default function EventForm({ initialId }: { initialId?: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [id, setId] = useState(initialId ?? "");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState(defaultDescription);
  const [bannerImage, setBannerImage] = useState("");
  const [location, setLocation] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [eventUrl, setEventUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<
    "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED"
  >("DRAFT");
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!initialId) return;
    fetch(`/api/events/${initialId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load event.");
        return data?.data;
      })
      .then((event) => {
        if (cancelled || !event) return;
        setId(event.id);
        setTitle(event.title ?? "");
        setSlug(event.slug ?? "");
        setDescription(event.description ?? defaultDescription);
        setBannerImage(event.bannerImage ?? "");
        setLocation(event.location ?? "");
        setIsOnline(Boolean(event.isOnline));
        setEventUrl(event.eventUrl ?? "");
        setStartDate(
          event.startDate
            ? new Date(event.startDate).toISOString().slice(0, 16)
            : "",
        );
        setEndDate(
          event.endDate
            ? new Date(event.endDate).toISOString().slice(0, 16)
            : "",
        );
        setStatus(event.status ?? "DRAFT");
        setIsEnabled(event.isEnabled ?? true);
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

    const validation = eventInputSchema.safeParse({
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      bannerImage,
      location: location.trim(),
      isOnline,
      eventUrl,
      startDate,
      endDate: endDate.trim(),
      status,
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
          bannerImage: validation.data.bannerImage || null,
          location: validation.data.location || null,
          eventUrl: validation.data.eventUrl || null,
          endDate: validation.data.endDate || null,
        };
        const saved = id
          ? await updateEvent(id, payload)
          : await createEvent(payload);
        setId(saved.id);
        setSuccess(id ? "Event updated." : "Event created.");
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
            <CardTitle className="text-xl">Create an event</CardTitle>
            <CardDescription>
              Dates, location, and a structured description.
            </CardDescription>
          </div>
          {id && <Badge variant="secondary">Editing</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <SlugGeneratorButton source={title} onGenerate={setSlug} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <RichTextEditor
            field={{
              value: description,
              onChange: setDescription,
            }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Banner image</Label>
            <Uploader value={bannerImage} onChange={setBannerImage} />
          </div>
          <div className="space-y-2">
            <Label>Event URL</Label>
            <Input
              value={eventUrl}
              onChange={(e) => setEventUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, venue, etc."
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-dashed bg-muted/30 p-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Online event</Label>
              <p className="text-xs text-muted-foreground">
                No physical location required.
              </p>
            </div>
            <Switch checked={isOnline} onCheckedChange={setIsOnline} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Start date</Label>
            <Input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>End date</Label>
            <Input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as typeof status)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="REVIEW">Review</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
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
        </div>

        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
        {success && (
          <p className="text-sm font-medium text-primary">{success}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <Button onClick={submit} disabled={isPending} className="w-full">
            {isPending ? "Saving..." : id ? "Update Event" : "Create Event"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
