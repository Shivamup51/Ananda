import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? undefined;

  const items = await prisma.pressItem.findMany({
    where: {
      OR: query
        ? [
            { title: { contains: query, mode: "insensitive" } },
            { source: { contains: query, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    take: 50,
  });

  return NextResponse.json({ data: items });
}

