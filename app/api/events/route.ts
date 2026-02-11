import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? undefined;

  const events = await prisma.event.findMany({
    where: {
      OR: query
        ? [
            { title: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: { startDate: "desc" },
    take: 50,
  });

  return NextResponse.json({ data: events });
}

