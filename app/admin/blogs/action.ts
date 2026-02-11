"use server";

import { updateTag } from "next/cache";
import prisma from "@/lib/prisma";

export type BlogInput = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isEnabled?: boolean;
  authorId: string;
  categoryId?: string | null;
  tags?: string[];
};

export async function createBlog(input: BlogInput) {
  const blog = await prisma.blog.create({
    data: {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt ?? null,
      content: input.content,
      featuredImage: input.featuredImage ?? null,
      status: input.status ?? "DRAFT",
      isEnabled: input.isEnabled ?? true,
      authorId: input.authorId,
      categoryId: input.categoryId ?? null,
      tags: input.tags
        ? {
            connect: input.tags.map((id) => ({ id })),
          }
        : undefined,
    },
  });

  updateTag("blogs");
  updateTag(`blogs:author:${input.authorId}`);
  return blog;
}

export async function updateBlog(id: string, input: Partial<BlogInput>) {
  const blog = await prisma.blog.update({
    where: { id },
    data: {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt !== undefined ? input.excerpt : undefined,
      content: input.content !== undefined ? input.content : undefined,
      featuredImage:
        input.featuredImage !== undefined ? input.featuredImage : undefined,
      status: input.status !== undefined ? input.status : undefined,
      isEnabled: input.isEnabled !== undefined ? input.isEnabled : undefined,
      authorId: input.authorId !== undefined ? input.authorId : undefined,
      categoryId: input.categoryId !== undefined ? input.categoryId : undefined,
      tags: input.tags
        ? {
            set: input.tags.map((tagId) => ({ id: tagId })),
          }
        : undefined,
    },
  });

  updateTag("blogs");
  if (blog.authorId) updateTag(`blogs:author:${blog.authorId}`);
  updateTag(`blog:${id}`);
  return blog;
}

export async function deleteBlog(id: string) {
  const blog = await prisma.blog.delete({ where: { id } });

  updateTag("blogs");
  if (blog.authorId) updateTag(`blogs:author:${blog.authorId}`);
  updateTag(`blog:${id}`);

  return blog;
}
