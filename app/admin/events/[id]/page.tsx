import Link from "next/link";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const revalidate = 30;

export default async function EventByIdPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await prisma.event.findUnique({ where: { id: params.id } });

  if (!event) {
    return (
      <div className="px-6 py-10">
        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Event not found</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            This event ID does not exist.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-background px-6 py-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Event
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              {event.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{event.slug}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={event.status === "PUBLISHED" ? "default" : "secondary"}>
              {event.status}
            </Badge>
            <Button asChild variant="outline">
              <Link href="/admin/events">Back</Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-lg">Overview</CardTitle>
            <p className="text-xs text-muted-foreground">
              Starts {event.startDate.toLocaleString()}
            </p>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Event ID
                </p>
                <p className="mt-2 font-medium text-foreground">{event.id}</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Mode
                </p>
                <p className="mt-2 font-medium text-foreground">
                  {event.isOnline ? "Online" : "In-person"}
                </p>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/10 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Location / URL
              </p>
              <p className="mt-2 text-sm text-foreground">
                {event.location || event.eventUrl || "—"}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/10 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Description
              </p>
              <pre className="mt-3 max-h-[420px] overflow-auto rounded-md bg-slate-950 p-4 text-xs text-slate-50">
                {JSON.stringify(event.description, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
