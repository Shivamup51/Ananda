import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const item = await prisma.pressItem.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Press item not found." }, { status: 404 });
  return NextResponse.json({ data: item });
}

