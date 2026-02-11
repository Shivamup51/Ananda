import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";

export const revalidate = 30;

const publishStatuses = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"] as const;
type PublishStatus = (typeof publishStatuses)[number];

function toPublishStatus(value: string | null): PublishStatus | undefined {
  if (!value) return undefined;
  return publishStatuses.includes(value as PublishStatus)
    ? (value as PublishStatus)
    : undefined;
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

export async function GET(request: NextRequest, _context: unknown) {
  try {
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get("authorId") ?? undefined;
    const status = toPublishStatus(searchParams.get("status"));
    const query = searchParams.get("q") ?? undefined;

    const blogs = await prisma.blog.findMany({
      where: {
        authorId,
        status,
        OR: query
          ? [
              { title: { contains: query, mode: "insensitive" } },
              { slug: { contains: query, mode: "insensitive" } },
            ]
          : undefined,
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ data: blogs });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch blogs.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, _context: unknown) {
  try {
    const body = (await request.json()) as Partial<{
      id: string;
      title: string;
      slug: string;
      excerpt: string | null;
      content: string;
      featuredImage: string | null;
      status: PublishStatus;
      isEnabled: boolean;
      authorId: string;
      categoryId: string | null;
      tags: string[]; // treated as tag names
    }>;

    if (!body?.title || !body?.slug || !body?.authorId) {
      return NextResponse.json(
        { error: "Title, slug, and authorId are required." },
        { status: 400 },
      );
    }

    // If a categoryId is provided but invalid, ignore it (treat as uncategorized).
    if (body.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: body.categoryId },
        select: { id: true },
      });
      if (!category) body.categoryId = null;
    }

    const tagIds = body.tags?.length ? await ensureTagIds(body.tags) : [];

    const blog = await prisma.blog.create({
      data: {
        id: body.id ?? crypto.randomUUID(),
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt ?? null,
        content: body.content ?? "",
        featuredImage: body.featuredImage ?? null,
        status: body.status ?? "DRAFT",
        isEnabled: body.isEnabled ?? true,
        authorId: body.authorId,
        categoryId: body.categoryId ?? null,
        tags: tagIds.length ? { connect: tagIds.map((id) => ({ id })) } : undefined,
      },
    });

    revalidateTag("blogs", "max");

    if (body.authorId) {
      revalidateTag(`blogs:author:${body.authorId}`, "max");
    }

    return NextResponse.json({ data: blog }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        { error: "Invalid relation ID (categoryId/tag/authorId)." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create blog.",
      },
      { status: 500 },
    );
  }
}
