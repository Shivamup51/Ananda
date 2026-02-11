import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const revalidate = 30;

export default async function PressByIdPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await prisma.pressItem.findUnique({ where: { id: params.id } });

  if (!item) {
    return (
      <div className="px-6 py-10">
        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Press item not found</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            This press item ID does not exist.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-background px-6 py-6">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Press
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              {item.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.source || "—"}
            </p>
          </div>
          <Button asChild variant="outline">
            <a href="/admin/press">Back</a>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Press ID
              </p>
              <p className="mt-2 font-medium text-foreground">{item.id}</p>
            </div>
            <div className="rounded-lg border bg-muted/10 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Link
              </p>
              <p className="mt-2 text-sm text-foreground">{item.link || "—"}</p>
            </div>
            <div className="rounded-lg border bg-muted/10 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Published
              </p>
              <p className="mt-2 text-sm text-foreground">
                {item.publishedAt ? item.publishedAt.toLocaleDateString() : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

