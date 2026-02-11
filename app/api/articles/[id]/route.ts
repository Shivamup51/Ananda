import { NextRequest, NextResponse } from "next/server";
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

export async function GET(_: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      tags: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      ...article,
      content: normalizeRichText(article.content),
    },
  });
}
