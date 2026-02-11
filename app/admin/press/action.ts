"use server";

import { updateTag } from "next/cache";
import prisma from "@/lib/prisma";

export type PressItemInput = {
  title: string;
  source?: string | null;
  link?: string | null;
  logo?: string | null;
  publishedAt?: string | null;
  isEnabled?: boolean;
};

export async function createPressItem(input: PressItemInput) {
  const item = await prisma.pressItem.create({
    data: {
      title: input.title,
      source: input.source ?? null,
      link: input.link ?? null,
      logo: input.logo ?? null,
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
      isEnabled: input.isEnabled ?? true,
    },
  });
  updateTag("press");
  updateTag(`press:${item.id}`);
  return item;
}

export async function updatePressItem(id: string, input: Partial<PressItemInput>) {
  const item = await prisma.pressItem.update({
    where: { id },
    data: {
      title: input.title,
      source: input.source !== undefined ? input.source : undefined,
      link: input.link !== undefined ? input.link : undefined,
      logo: input.logo !== undefined ? input.logo : undefined,
      publishedAt:
        input.publishedAt !== undefined
          ? input.publishedAt
            ? new Date(input.publishedAt)
            : null
          : undefined,
      isEnabled: input.isEnabled,
    },
  });
  updateTag("press");
  updateTag(`press:${id}`);
  return item;
}

export async function deletePressItem(id: string) {
  const item = await prisma.pressItem.delete({ where: { id } });
  updateTag("press");
  updateTag(`press:${id}`);
  return item;
}

