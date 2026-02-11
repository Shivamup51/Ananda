import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authorId = searchParams.get("authorId") ?? undefined;
  const query = searchParams.get("q") ?? undefined;

  const articles = await prisma.article.findMany({
    where: {
      authorId,
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

  return NextResponse.json({ data: articles });
}
