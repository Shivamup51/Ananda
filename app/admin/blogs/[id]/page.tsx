import Link from "next/link";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const revalidate = 30;

export default async function BlogByIdPage({
  params,
}: {
  params: { id: string };
}) {
  const blog = await prisma.blog.findUnique({ where: { id: params.id } });

  if (!blog) {
    return (
      <div className="px-6 py-10">
        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Blog not found</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            This blog ID does not exist.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-[radial-gradient(circle_at_top,rgba(12,74,110,0.16),transparent_55%),radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.22),transparent_45%)] px-6 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Blog
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              {blog.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{blog.slug}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={blog.status === "PUBLISHED" ? "default" : "secondary"}>
              {blog.status}
            </Badge>
            <Button asChild variant="outline">
              <Link href="/admin/blogs">Back</Link>
            </Button>
          </div>
        </div>

        <Card className="border-0 bg-white/90 shadow-xl shadow-slate-100/70 backdrop-blur">
          <CardHeader className="space-y-2">
            <CardTitle className="text-lg">Overview</CardTitle>
            <p className="text-xs text-muted-foreground">
              Updated {blog.updatedAt.toLocaleString()}
            </p>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Blog ID
                </p>
                <p className="mt-2 font-medium text-slate-700">{blog.id}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Author ID
                </p>
                <p className="mt-2 font-medium text-slate-700">{blog.authorId}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Excerpt
              </p>
              <p className="mt-2 text-sm text-slate-700">
                {blog.excerpt || "No excerpt provided."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Content
              </p>
              <pre className="mt-3 max-h-[420px] overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-50">
                {JSON.stringify(blog.content, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
