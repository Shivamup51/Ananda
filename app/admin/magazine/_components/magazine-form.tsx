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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createMagazineIssue, updateMagazineIssue } from "../action";
import Uploader from "@/components/uploader";
import { SlugGeneratorButton } from "@/components/ui/slug-generator";
import { magazineInputSchema } from "@/lib/zodSchema";

export default function MagazineForm({ initialId }: { initialId?: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [id, setId] = useState(initialId ?? "");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [theme, setTheme] = useState("");
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [coverImage, setCoverImage] = useState("");
  const [description, setDescription] = useState("");
  const [flipbookUrl, setFlipbookUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [status, setStatus] = useState<
    "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED"
  >("DRAFT");
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!initialId) return;
    fetch(`/api/magazine-issues/${initialId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Failed to load issue.");
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        const issue = data.data;
        setId(issue.id);
        setTitle(issue.title ?? "");
        setSlug(issue.slug ?? "");
        setTheme(issue.theme ?? "");
        setMonth(issue.month ?? month);
        setYear(issue.year ?? year);
        setCoverImage(issue.coverImage ?? "");
        setDescription(issue.description ?? "");
        setFlipbookUrl(issue.flipbookUrl ?? "");
        setPdfUrl(issue.pdfUrl ?? "");
        setStatus(issue.status ?? "DRAFT");
        setIsEnabled(issue.isEnabled ?? true);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load issue.");
      });

    return () => {
      cancelled = true;
    };
  }, [initialId]);

  function submit() {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const rawPayload = {
          title: title.trim(),
          slug: slug.trim(),
          theme: theme.trim(),
          month,
          year,
          coverImage,
          description: description.trim(),
          flipbookUrl,
          pdfUrl,
          status,
          isEnabled,
        };

        const validation = magazineInputSchema.safeParse(rawPayload);
        if (!validation.success) {
          setError(validation.error.issues[0]?.message ?? "Invalid form data.");
          return;
        }

        const payload = {
          ...validation.data,
          theme: validation.data.theme || null,
          description: validation.data.description || null,
          pdfUrl: validation.data.pdfUrl || null,
        };

        const saved = id
          ? await updateMagazineIssue(id, payload)
          : await createMagazineIssue(payload);

        setId(saved.id);
        setSuccess(id ? "Issue updated." : "Issue created.");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save issue.");
      }
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Magazine Issue</CardTitle>
            <CardDescription>
              Professional uploader-based workflow
            </CardDescription>
          </div>
          {id && <Badge variant="secondary">Editing</Badge>}
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* TITLE + SLUG */}
        <div className="grid md:grid-cols-2 gap-6">
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

        {/* DATE + THEME */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Month</Label>
            <Input
              value={String(month)}
              onChange={(e) => setMonth(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <Input
              value={String(year)}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Theme</Label>
            <Input value={theme} onChange={(e) => setTheme(e.target.value)} />
          </div>
        </div>

        {/* UPLOADERS */}
        <div className="space-y-4">
          <div>
            <Label>Cover Image</Label>
            <Uploader
              value={coverImage}
              onChange={setCoverImage}
              accept="image/*"
            />
          </div>

          <div>
            <Label>Flipbook File</Label>
            <Uploader
              value={flipbookUrl}
              onChange={setFlipbookUrl}
              accept="application/pdf,.pdf"
            />
          </div>

          <div>
            <Label>PDF File (Optional)</Label>
            <Uploader
              value={pdfUrl}
              onChange={setPdfUrl}
              accept="application/pdf,.pdf"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* STATUS */}
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="w-60">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="REVIEW">Review</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 border rounded-lg px-4 py-2">
            <Label>Enabled</Label>
            <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-primary">{success}</p>}

        <Button onClick={submit} disabled={isPending} className="w-full">
          {isPending ? "Saving..." : id ? "Update Issue" : "Create Issue"}
        </Button>
      </CardContent>
    </Card>
  );
}
