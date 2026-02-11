import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 30;

export default async function MagazineIssueByIdPage({
  params,
}: {
  params: { id: string };
}) {
  const issue = await prisma.magazineIssue.findUnique({
    where: { id: params.id },
  });

  if (!issue) {
    return (
      <div className="px-6 py-10">
        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Issue not found</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            This magazine issue ID does not exist.
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
              Magazine
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              {issue.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{issue.slug}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={issue.status === "PUBLISHED" ? "default" : "secondary"}>
              {issue.status}
            </Badge>
            <Button asChild variant="outline">
              <a href="/admin/magazine">Back</a>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Issue details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Issue Date
                </p>
                <p className="mt-2 font-medium text-foreground">
                  {issue.month}/{issue.year}
                </p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Theme
                </p>
                <p className="mt-2 font-medium text-foreground">
                  {issue.theme || "-"}
                </p>
              </div>
            </div>

            {issue.coverImage ? (
              <div className="rounded-lg border bg-muted/10 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Cover image
                </p>
                <img
                  src={issue.coverImage}
                  alt={issue.title}
                  className="mt-3 max-h-[420px] w-full rounded-md object-cover"
                />
              </div>
            ) : null}

            <div className="rounded-lg border bg-muted/10 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Description
              </p>
              <p className="mt-2 text-sm text-foreground">
                {issue.description || "No description provided."}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border bg-muted/10 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Flipbook URL
                </p>
                <p className="mt-2 break-all text-sm text-foreground">
                  {issue.flipbookUrl || "-"}
                </p>
              </div>
              <div className="rounded-lg border bg-muted/10 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  PDF URL
                </p>
                <p className="mt-2 break-all text-sm text-foreground">
                  {issue.pdfUrl || "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
