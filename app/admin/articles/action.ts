"use server";

import { updateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { ZodError } from "zod";
import { articleInputSchema, type ArticleInputSchema } from "@/lib/zodSchema";

export type ArticleInput = ArticleInputSchema;

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

function formatValidationError(error: ZodError) {
  return error.issues.map((issue) => issue.message).join(" ");
}

export async function createArticle(input: ArticleInput) {
  let validatedInput: ArticleInput;

  try {
    validatedInput = articleInputSchema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(formatValidationError(error));
    }
    throw error;
  }

  const tagIds = await ensureTagIds(validatedInput.tags);
  const article = await prisma.article.create({
    data: {
      title: validatedInput.title,
      slug: validatedInput.slug,
      standfirst: validatedInput.standfirst,
      content: validatedInput.content,
      featuredImage: validatedInput.featuredImage,
      status: validatedInput.status,
      isEnabled: validatedInput.isEnabled,
      authorId: validatedInput.authorId,
      tags: tagIds.length ? { connect: tagIds.map((id) => ({ id })) } : undefined,
    },
  });

  updateTag("articles");
  updateTag(`articles:author:${validatedInput.authorId}`);
  return article;
}

export async function updateArticle(id: string, input: ArticleInput) {
  if (!id.trim()) {
    throw new Error("Article ID is required.");
  }

  let validatedInput: ArticleInput;

  try {
    validatedInput = articleInputSchema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(formatValidationError(error));
    }
    throw error;
  }

  const tagIds = await ensureTagIds(validatedInput.tags);
  const article = await prisma.article.update({
    where: { id },
    data: {
      title: validatedInput.title,
      slug: validatedInput.slug,
      standfirst: validatedInput.standfirst,
      content: validatedInput.content,
      featuredImage: validatedInput.featuredImage,
      status: validatedInput.status,
      isEnabled: validatedInput.isEnabled,
      authorId: validatedInput.authorId,
      tags: {
        set: tagIds.map((tagId) => ({ id: tagId })),
      },
    },
  });

  updateTag("articles");
  if (article.authorId) updateTag(`articles:author:${article.authorId}`);
  updateTag(`article:${id}`);
  return article;
}

export async function deleteArticle(id: string) {
  const article = await prisma.article.delete({ where: { id } });
  updateTag("articles");
  if (article.authorId) updateTag(`articles:author:${article.authorId}`);
  updateTag(`article:${id}`);
  return article;
}
