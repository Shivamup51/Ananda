"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { blogInputSchema } from "@/lib/zodSchema";
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
import { SlugGeneratorButton } from "@/components/ui/slug-generator";
import Uploader from "@/components/uploader";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";

const defaultContent = "<p>Start writing your blog content here.</p>";

type BlogDetails = {
  id: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  content?: string | null;
  featuredImage?: string | null;
  status?: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";
  isEnabled?: boolean | null;
  tags?: Array<{ name?: string | null }>;
};

export default function BlogForm({
  initialBlogId,
}: {
  initialBlogId?: string;
}) {
  const session = authClient.useSession();
  const userId = session.data?.user?.id;

  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [blogId, setBlogId] = useState(initialBlogId ?? "");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState(defaultContent);
  const [featuredImage, setFeaturedImage] = useState("");
  const [status, setStatus] = useState<
    "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED"
  >("DRAFT");
  const [isEnabled, setIsEnabled] = useState(true);
  const [tags, setTags] = useState("");

  const wordCount = useMemo(
    () => excerpt.trim().split(/\s+/).filter(Boolean).length,
    [excerpt],
  );

  useEffect(() => {
    let cancelled = false;
    if (!initialBlogId) return;

    setFormError(null);
    fetch(`/api/blogs/${initialBlogId}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data?.error ?? "Failed to load blog.");
        return data?.data as BlogDetails;
      })
      .then((blog) => {
        if (cancelled || !blog) return;
        setBlogId(blog.id);
        setTitle(blog.title ?? "");
        setSlug(blog.slug ?? "");
        setExcerpt(blog.excerpt ?? "");
        setContent(blog.content ?? defaultContent);
        setFeaturedImage(blog.featuredImage ?? "");
        setStatus(blog.status ?? "DRAFT");
        setIsEnabled(blog.isEnabled ?? true);
        setTags(
          Array.isArray(blog.tags)
            ? blog.tags
                .map((tag) => tag?.name?.trim() ?? "")
                .filter(Boolean)
                .join(", ")
            : "",
        );
      })
      .catch((error) => {
        if (cancelled) return;
        setFormError(
          error instanceof Error ? error.message : "Failed to load blog.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [initialBlogId]);

  function handleSubmit() {
    setFormError(null);
    setSuccess(null);

    if (!userId) {
      setFormError("Please sign in to create blogs.");
      return;
    }

    const tagList = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const validation = blogInputSchema.safeParse({
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      featuredImage,
      status,
      isEnabled,
      authorId: userId,
      tags: tagList,
    });

    if (!validation.success) {
      setFormError(validation.error.issues[0]?.message ?? "Invalid form data.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(
          blogId ? `/api/blogs/${blogId}` : "/api/blogs",
          {
            method: blogId ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...validation.data,
              excerpt: validation.data.excerpt || null,
              featuredImage: validation.data.featuredImage || null,
            }),
          },
        );

        const data = await response.json();
        if (!response.ok)
          throw new Error(data?.error || "Failed to save blog.");

        setSuccess(
          blogId ? "Blog updated successfully." : "Blog created successfully.",
        );
        if (!blogId) setBlogId(data?.data?.id || "");
      } catch (error) {
        setFormError(
          error instanceof Error ? error.message : "Something went wrong.",
        );
      }
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Blog</CardTitle>
            <CardDescription>
              Professional uploader-based workflow
            </CardDescription>
          </div>
          {blogId && <Badge variant="secondary">Editing</Badge>}
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <div className="flex gap-2">
              <Input
                id="slug"
                className="flex-1"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
              />
              <SlugGeneratorButton source={title} onGenerate={setSlug} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Badge variant="secondary">{wordCount} words</Badge>
          </div>
          <Textarea
            id="excerpt"
            rows={4}
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <RichTextEditor
            field={{
              value: content,
              onChange: setContent,
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>Featured Image</Label>
          <Uploader value={featuredImage} onChange={setFeaturedImage} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
          />
        </div>

        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="w-60">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as typeof status)}
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

          <div className="flex items-center gap-3 border rounded-lg px-4 py-2">
            <Label>Enabled</Label>
            <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
          </div>
        </div>

        {formError && <p className="text-sm text-destructive">{formError}</p>}
        {success && <p className="text-sm text-primary">{success}</p>}

        <Button onClick={handleSubmit} disabled={isPending} className="w-full">
          {isPending ? "Saving..." : blogId ? "Update Blog" : "Create Blog"}
        </Button>
      </CardContent>
    </Card>
  );
}
