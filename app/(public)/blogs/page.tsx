import { ContentCard } from "../_components/content-card";
import { PaginationNav } from "../_components/pagination-nav";
import { SearchFilterBar } from "../_components/search-filter-bar";
import { SectionHeader } from "../_components/section-header";
import { getBlogs } from "@/lib/public-content";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BlogsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const sort = params.sort === "asc" ? "asc" : "desc";
  const page = Math.max(1, Number(typeof params.page === "string" ? params.page : "1") || 1);
  const pageSize = 9;
  const blogs = await getBlogs({ q, sort });
  const start = (page - 1) * pageSize;
  const pagedBlogs = blogs.slice(start, start + pageSize);
  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (sort) query.set("sort", sort);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Blogs"
        title="Latest Published Blogs"
        description="Explore published stories from the editorial desk."
      />
      <div className="mt-6">
        <SearchFilterBar searchPlaceholder="Search blogs..." />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {pagedBlogs.map((blog) => (
          <ContentCard
            key={blog.id}
            href={`/blogs/${blog.id}`}
            image={blog.featuredImage}
            title={blog.title}
            description={blog.excerpt}
            meta={blog.publishedAt?.toLocaleDateString()}
            badge={blog.category?.name || "Blog"}
          />
        ))}
      </div>
      <PaginationNav
        currentPage={page}
        totalItems={blogs.length}
        pageSize={pageSize}
        basePath="/blogs"
        queryParams={query}
      />
    </section>
  );
}
