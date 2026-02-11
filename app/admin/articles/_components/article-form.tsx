"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { createArticle, updateArticle } from "../action";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { SlugGeneratorButton } from "@/components/ui/slug-generator";
import Uploader from "@/components/uploader";
import { articleInputSchema } from "@/lib/zodSchema";

const defaultContent = "<p>Start writing your article content here.</p>";

function normalizeContent(value: unknown): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return defaultContent;

  const record = value as Record<string, unknown>;
  if (typeof record.content === "string") return record.content;
  if (typeof record.html === "string") return record.html;
  if (typeof record.notes === "string") return record.notes;

  return defaultContent;
}

export default function ArticleForm({
  initialArticleId,
}: {
  initialArticleId?: string;
}) {
  const session = authClient.useSession();
  const userId = session.data?.user?.id;

  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [articleId, setArticleId] = useState(initialArticleId ?? "");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [standfirst, setStandfirst] = useState("");
  const [content, setContent] = useState(defaultContent);
  const [featuredImage, setFeaturedImage] = useState("");
  const [status, setStatus] = useState<
    "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED"
  >("DRAFT");
  const [isEnabled, setIsEnabled] = useState(true);
  const [tags, setTags] = useState("");

  const standfirstCount = useMemo(
    () => standfirst.trim().split(/\s+/).filter(Boolean).length,
    [standfirst],
  );

  useEffect(() => {
    if (!initialArticleId) return;
    fetch(`/api/articles/${initialArticleId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Failed to load article.");
        return data;
      })
      .then((data) => {
        const a = data.data;
        setArticleId(a.id);
        setTitle(a.title ?? "");
        setSlug(a.slug ?? "");
        setStandfirst(a.standfirst ?? "");
        setContent(normalizeContent(a.content));
        setFeaturedImage(a.featuredImage ?? "");
        setStatus(a.status ?? "DRAFT");
        setIsEnabled(a.isEnabled ?? true);
        setTags(
          Array.isArray(a.tags)
            ? a.tags
                .map((tag: { name?: string }) => tag?.name ?? "")
                .filter(Boolean)
                .join(", ")
            : "",
        );
      })
      .catch((error) => {
        setFormError(
          error instanceof Error ? error.message : "Failed to load article.",
        );
      });
  }, [initialArticleId]);

  function handleSubmit() {
    setFormError(null);
    setSuccess(null);

    if (!userId) return setFormError("Please sign in.");

    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      standfirst: standfirst.trim(),
      content: content.trim() || defaultContent,
      featuredImage: featuredImage.trim(),
      status,
      isEnabled,
      authorId: userId,
      tags: parsedTags,
    };

    const validation = articleInputSchema.safeParse(payload);
    if (!validation.success) {
      setFormError(validation.error.issues[0]?.message ?? "Invalid form data.");
      return;
    }

    startTransition(async () => {
      try {
        const saved = articleId
          ? await updateArticle(articleId, validation.data)
          : await createArticle(validation.data);
        setArticleId(saved.id);
        setSuccess("Saved successfully.");
      } catch (error) {
        setFormError(
          error instanceof Error ? error.message : "Failed to save article.",
        );
      }
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Article Editor</CardTitle>
        <CardDescription>Professional editorial workflow.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* TITLE */}
        <div className="space-y-2">
          <Label>Title</Label>
          <div className="flex gap-2">
            <Input
              className="flex-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        {/* SLUG */}
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

        {/* STANDFIRST */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Standfirst</Label>
            <Badge variant="secondary">{standfirstCount} words</Badge>
          </div>
          <Textarea
            rows={4}
            value={standfirst}
            onChange={(e) => setStandfirst(e.target.value)}
          />
        </div>

        {/* CONTENT */}
        <div className="space-y-2">
          <Label>Content</Label>
          <RichTextEditor
            field={{
              value: content,
              onChange: setContent,
            }}
          />
        </div>

        {/* FEATURE IMAGE */}
        <div className="space-y-2">
          <Label>Featured Image</Label>
          <div className="relative rounded-md border-dashed border-2 border-muted p-4">
            <Uploader value={featuredImage} onChange={setFeaturedImage} />
          </div>
        </div>

        {/* TAGS */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <Input value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>

        {/* STATUS ROW */}
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="w-60">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) =>
                setStatus(v as "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED")
              }
            >
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
            <Label>Enable Article</Label>
            <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
          </div>
        </div>

        {formError && <p className="text-sm text-destructive">{formError}</p>}
        {success && <p className="text-sm text-primary">{success}</p>}

        <Button onClick={handleSubmit} disabled={isPending} className="w-full">
          {isPending ? "Saving..." : "Save Article"}
        </Button>
      </CardContent>
    </Card>
  );
}
