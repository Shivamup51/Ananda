"use server";

import { updateTag } from "next/cache";
import prisma from "@/lib/prisma";

export type EventInput = {
  title: string;
  slug: string;
  description: string;
  bannerImage?: string | null;
  location?: string | null;
  isOnline?: boolean;
  eventUrl?: string | null;
  startDate: string;
  endDate?: string | null;
  status?: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";
  isEnabled?: boolean;
};

export async function createEvent(input: EventInput) {
  const event = await prisma.event.create({
    data: {
      title: input.title,
      slug: input.slug,
      description: input.description,
      bannerImage: input.bannerImage ?? null,
      location: input.location ?? null,
      isOnline: input.isOnline ?? false,
      eventUrl: input.eventUrl ?? null,
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : null,
      status: input.status ?? "DRAFT",
      isEnabled: input.isEnabled ?? true,
    },
  });
  updateTag("events");
  updateTag(`event:${event.id}`);
  return event;
}

export async function updateEvent(id: string, input: Partial<EventInput>) {
  const event = await prisma.event.update({
    where: { id },
    data: {
      title: input.title,
      slug: input.slug,
      description: input.description !== undefined ? input.description : undefined,
      bannerImage: input.bannerImage !== undefined ? input.bannerImage : undefined,
      location: input.location !== undefined ? input.location : undefined,
      isOnline: input.isOnline !== undefined ? input.isOnline : undefined,
      eventUrl: input.eventUrl !== undefined ? input.eventUrl : undefined,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate !== undefined ? (input.endDate ? new Date(input.endDate) : null) : undefined,
      status: input.status,
      isEnabled: input.isEnabled,
    },
  });
  updateTag("events");
  updateTag(`event:${id}`);
  return event;
}

export async function deleteEvent(id: string) {
  const event = await prisma.event.delete({ where: { id } });
  updateTag("events");
  updateTag(`event:${id}`);
  return event;
}
