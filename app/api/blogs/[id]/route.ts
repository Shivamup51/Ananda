import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function normalizeRichText(value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("<")) return trimmed;

    try {
      const parsed = JSON.parse(trimmed) as Record<string, unknown>;
      if (typeof parsed.content === "string") return normalizeRichText(parsed.content);
      if (typeof parsed.html === "string") return normalizeRichText(parsed.html);
      if (typeof parsed.notes === "string") return normalizeRichText(parsed.notes);
    } catch {
      return `<p>${trimmed.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</p>`;
    }

    return `<p>${trimmed.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</p>`;
  }
  if (!value || typeof value !== "object") return "";
  const record = value as Record<string, unknown>;
  if (typeof record.content === "string") return record.content;
  if (typeof record.html === "string") return record.html;
  if (typeof record.notes === "string") return record.notes;
  return "";
}

function slugifyTag(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function ensureTagIds(tagNames: string[]) {
  const unique = Array.from(
    new Set(tagNames.map((t) => t.trim()).filter(Boolean)),
  ).slice(0, 20);

  if (!unique.length) return [];

  const ids: string[] = [];
  for (const name of unique) {
    const slug = slugifyTag(name);
    if (!slug) continue;
    const tag = await prisma.tag.upsert({
      where: { slug },
      create: { name, slug },
      update: { name },
      select: { id: true },
    });
    ids.push(tag.id);
  }
  return ids;
}

function isPrismaKnownRequestError(
  error: unknown,
): error is { code: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
  );
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        tags: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found." }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        ...blog,
        content: normalizeRichText(blog.content),
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch blog.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<{
      title: string;
      slug: string;
      excerpt: string | null;
      content: string;
      featuredImage: string | null;
      status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
      isEnabled: boolean;
      authorId: string;
      categoryId: string | null;
      tags: string[]; // treated as tag names
    }>;

    // If a categoryId is provided but invalid, ignore it (treat as uncategorized).
    if (body.categoryId !== undefined && body.categoryId !== null) {
      const category = await prisma.category.findUnique({
        where: { id: body.categoryId },
        select: { id: true },
      });
      if (!category) body.categoryId = null;
    }

    const tagIds = body.tags?.length ? await ensureTagIds(body.tags) : undefined;

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title: body.title ?? undefined,
        slug: body.slug ?? undefined,
        excerpt: body.excerpt !== undefined ? body.excerpt : undefined,
        content: body.content !== undefined ? body.content : undefined,
        featuredImage:
          body.featuredImage !== undefined ? body.featuredImage : undefined,
        status: body.status ?? undefined,
        isEnabled: body.isEnabled ?? undefined,
        authorId: body.authorId ?? undefined,
        categoryId: body.categoryId !== undefined ? body.categoryId : undefined,
        tags:
          tagIds !== undefined
            ? {
                set: tagIds.map((tagId) => ({ id: tagId })),
              }
            : undefined,
      },
    });
    revalidateTag("blogs", "max");

    if (blog.authorId) {
      revalidateTag(`blogs:author:${blog.authorId}`, "max");
    }

    revalidateTag(`blog:${id}`, "max");

    return NextResponse.json({ data: blog });
  } catch (error: unknown) {
    if (isPrismaKnownRequestError(error) && error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid relation ID (categoryId/tag/authorId)." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update blog.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const blog = await prisma.blog.delete({ where: { id } });

    revalidateTag("blogs", "max");
    if (blog.authorId) revalidateTag(`blogs:author:${blog.authorId}`, "max");
    revalidateTag(`blog:${id}`, "max");

    return NextResponse.json({ data: blog });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete blog.",
      },
      { status: 500 },
    );
  }
}
