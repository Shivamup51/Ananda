"use server";

import { updateTag } from "next/cache";
import prisma from "@/lib/prisma";

export type MagazineIssueInput = {
  title: string;
  slug: string;
  theme?: string | null;
  month: number;
  year: number;
  coverImage: string;
  description?: string | null;
  flipbookUrl: string;
  pdfUrl?: string | null;
  status?: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";
  isEnabled?: boolean;
};

export async function createMagazineIssue(input: MagazineIssueInput) {
  const issue = await prisma.magazineIssue.create({
    data: {
      title: input.title,
      slug: input.slug,
      theme: input.theme ?? null,
      month: input.month,
      year: input.year,
      coverImage: input.coverImage,
      description: input.description ?? null,
      flipbookUrl: input.flipbookUrl,
      pdfUrl: input.pdfUrl ?? null,
      status: input.status ?? "DRAFT",
      isEnabled: input.isEnabled ?? true,
    },
  });

  updateTag("magazine-issues");
  updateTag(`magazine-issue:${issue.id}`);
  return issue;
}

export async function updateMagazineIssue(
  id: string,
  input: Partial<MagazineIssueInput>,
) {
  const issue = await prisma.magazineIssue.update({
    where: { id },
    data: {
      title: input.title,
      slug: input.slug,
      theme: input.theme !== undefined ? input.theme : undefined,
      month: input.month,
      year: input.year,
      coverImage: input.coverImage,
      description:
        input.description !== undefined ? input.description : undefined,
      flipbookUrl: input.flipbookUrl,
      pdfUrl: input.pdfUrl !== undefined ? input.pdfUrl : undefined,
      status: input.status,
      isEnabled: input.isEnabled,
    },
  });

  updateTag("magazine-issues");
  updateTag(`magazine-issue:${id}`);
  return issue;
}

export async function deleteMagazineIssue(id: string) {
  const issue = await prisma.magazineIssue.delete({ where: { id } });
  updateTag("magazine-issues");
  updateTag(`magazine-issue:${id}`);
  return issue;
}
