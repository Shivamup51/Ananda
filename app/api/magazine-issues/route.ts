import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? undefined;
  const year = searchParams.get("year") ? Number(searchParams.get("year")) : undefined;

  const issues = await prisma.magazineIssue.findMany({
    where: {
      year,
      OR: query
        ? [
            { title: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: [{ year: "desc" }, { month: "desc" }, { createdAt: "desc" }],
    take: 50,
  });

  return NextResponse.json({ data: issues });
}

