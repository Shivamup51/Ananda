import Link from "next/link";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 120;

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

const getOverviewCounts = unstable_cache(
  async () => {
    const [magazineIssues, blogs, articles, events] = await Promise.all([
      prisma.magazineIssue.count(),
      prisma.blog.count(),
      prisma.article.count(),
      prisma.event.count(),
    ]);

    return { magazineIssues, blogs, articles, events };
  },
  ["admin-dashboard-overview"],
  {
    revalidate: 120,
    tags: ["magazine-issues", "blogs", "articles", "events"],
  },
);

const getLatestMagazine = unstable_cache(
  async () =>
    prisma.magazineIssue.findMany({
      select: {
        id: true,
        title: true,
        month: true,
        year: true,
        status: true,
      },
      orderBy: [{ year: "desc" }, { month: "desc" }],
      take: 5,
    }),
  ["admin-dashboard-latest-magazine"],
  { revalidate: 120, tags: ["magazine-issues"] },
);

const getLatestBlogs = unstable_cache(
  async () =>
    prisma.blog.findMany({
      select: { id: true, title: true, status: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ["admin-dashboard-latest-blogs"],
  { revalidate: 120, tags: ["blogs"] },
);

const getLatestArticles = unstable_cache(
  async () =>
    prisma.article.findMany({
      select: { id: true, title: true, status: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ["admin-dashboard-latest-articles"],
  { revalidate: 120, tags: ["articles"] },
);

const getLatestEvents = unstable_cache(
  async () =>
    prisma.event.findMany({
      select: { id: true, title: true, status: true, startDate: true },
      orderBy: { startDate: "desc" },
      take: 5,
    }),
  ["admin-dashboard-latest-events"],
  { revalidate: 120, tags: ["events"] },
);

const getLatestPress = unstable_cache(
  async () =>
    prisma.pressItem.findMany({
      select: { id: true, title: true, source: true, publishedAt: true },
      orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
      take: 5,
    }),
  ["admin-dashboard-latest-press"],
  { revalidate: 120, tags: ["press"] },
);

function SectionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-10 animate-pulse rounded bg-muted" />
        <div className="h-10 animate-pulse rounded bg-muted" />
        <div className="h-10 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}

async function OverviewCards() {
  const counts = await getOverviewCounts();
  const items = [
    { label: "Magazine Issues", value: counts.magazineIssues, href: "/admin/magazine" },
    { label: "Blogs", value: counts.blogs, href: "/admin/blogs" },
    { label: "Posts / Articles", value: counts.articles, href: "/admin/articles" },
    { label: "Events", value: counts.events, href: "/admin/events" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item: (typeof items)[number]) => (
        <Card key={item.label}>
          <CardHeader className="space-y-1 pb-2">
            <CardDescription>{item.label}</CardDescription>
            <CardTitle className="text-3xl">{item.value}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Link className="text-xs text-primary hover:underline" href={item.href}>
              Manage
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function MagazineSection() {
  const items = await getLatestMagazine();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Latest Magazine Issues</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length ? (
          items.map((item: (typeof items)[number]) => (
            <div key={item.id} className="rounded-md border p-3">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.month}/{item.year} | {item.status}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No issues yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

async function BlogsSection() {
  const items = await getLatestBlogs();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Latest Blogs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length ? (
          items.map((item: (typeof items)[number]) => (
            <div key={item.id} className="rounded-md border p-3">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.status} | {formatDate(item.updatedAt)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No blogs yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

async function ArticlesSection() {
  const items = await getLatestArticles();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Latest Posts / Articles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length ? (
          items.map((item: (typeof items)[number]) => (
            <div key={item.id} className="rounded-md border p-3">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.status} | {formatDate(item.updatedAt)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No articles yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

async function EventsSection() {
  const items = await getLatestEvents();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Latest Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length ? (
          items.map((item: (typeof items)[number]) => (
            <div key={item.id} className="rounded-md border p-3">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.status} | {formatDate(item.startDate)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No events yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

async function PressSection() {
  const items = await getLatestPress();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Latest Press</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length ? (
          items.map((item) => (
            <div key={item.id} className="rounded-md border p-3">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.source || "Unknown source"} | {formatDate(item.publishedAt)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No press items yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-background px-6 py-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Admin Dashboard
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Overview
          </h1>
          <p className="max-w-2xl text-xs text-muted-foreground">
            Pre-rendered summary with cached data and streamed sections.
          </p>
        </div>

        <Suspense fallback={<SectionSkeleton />}>
          <OverviewCards />
        </Suspense>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Suspense fallback={<SectionSkeleton />}>
            <MagazineSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <BlogsSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <ArticlesSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <EventsSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <PressSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
