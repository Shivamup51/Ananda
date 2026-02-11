import { Newspaper } from "lucide-react";
import { ContentCard } from "../_components/content-card";
import { PaginationNav } from "../_components/pagination-nav";
import { SearchFilterBar } from "../_components/search-filter-bar";
import { SectionHeader } from "../_components/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { getPosts } from "@/lib/public-content";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PostsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const sort = params.sort === "asc" ? "asc" : "desc";
  const page = Math.max(1, Number(typeof params.page === "string" ? params.page : "1") || 1);
  const pageSize = 9;
  const posts = await getPosts({ q, sort });
  const start = (page - 1) * pageSize;
  const pagedPosts = posts.slice(start, start + pageSize);
  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (sort) query.set("sort", sort);

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border bg-gradient-to-r from-background to-muted/25 p-6 sm:p-8">
        <SectionHeader
          eyebrow="Posts"
          title="Media Highlights and Short Updates"
          description="A clean feed of published references, source notes, and external media mentions."
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Card className="rounded-2xl py-0">
            <CardContent className="flex items-center justify-between px-4 py-4">
              <p className="text-sm text-muted-foreground">Published Entries</p>
              <p className="text-lg font-semibold">{posts.length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl py-0">
            <CardContent className="flex items-center justify-between px-4 py-4">
              <p className="text-sm text-muted-foreground">Content Type</p>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Newspaper className="size-4 text-primary" />
                Post
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl py-0">
            <CardContent className="flex items-center justify-between px-4 py-4">
              <p className="text-sm text-muted-foreground">Sort Order</p>
              <p className="text-sm font-medium">{sort === "desc" ? "Newest First" : "Oldest First"}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <SearchFilterBar searchPlaceholder="Search posts, sources..." />

      {pagedPosts.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {pagedPosts.map((post) => (
            <ContentCard
              key={post.id}
              href={`/posts/${post.id}`}
              image={post.logo}
              title={post.title}
              description={post.source || "Editorial post"}
              meta={post.publishedAt?.toLocaleDateString()}
              badge="Post"
            />
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl py-0">
          <CardContent className="px-6 py-12 text-center text-sm text-muted-foreground">
            No posts found for this query.
          </CardContent>
        </Card>
      )}

      <PaginationNav
        currentPage={page}
        totalItems={posts.length}
        pageSize={pageSize}
        basePath="/posts"
        queryParams={query}
      />
    </section>
  );
}
