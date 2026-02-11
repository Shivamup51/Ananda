import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const issue = await prisma.magazineIssue.findUnique({
    where: { id },
    include: { highlights: true },
  });

  if (!issue) {
    return NextResponse.json({ error: "Issue not found." }, { status: 404 });
  }

  return NextResponse.json({ data: issue });
}

