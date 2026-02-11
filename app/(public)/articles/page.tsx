import { ContentCard } from "../_components/content-card";
import { PaginationNav } from "../_components/pagination-nav";
import { SearchFilterBar } from "../_components/search-filter-bar";
import { SectionHeader } from "../_components/section-header";
import { getArticles } from "@/lib/public-content";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ArticlesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const sort = params.sort === "asc" ? "asc" : "desc";
  const page = Math.max(1, Number(typeof params.page === "string" ? params.page : "1") || 1);
  const pageSize = 9;
  const articles = await getArticles({ q, sort });
  const start = (page - 1) * pageSize;
  const pagedArticles = articles.slice(start, start + pageSize);
  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (sort) query.set("sort", sort);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Articles"
        title="Latest Published Articles"
        description="Long-form, premium editorial pieces optimized for readability."
      />
      <div className="mt-6">
        <SearchFilterBar searchPlaceholder="Search articles..." />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {pagedArticles.map((article) => (
          <ContentCard
            key={article.id}
            href={`/articles/${article.id}`}
            image={article.featuredImage}
            title={article.title}
            description={article.standfirst}
            meta={article.publishedAt?.toLocaleDateString()}
            badge={article.category?.name || "Article"}
          />
        ))}
      </div>
      <PaginationNav
        currentPage={page}
        totalItems={articles.length}
        pageSize={pageSize}
        basePath="/articles"
        queryParams={query}
      />
    </section>
  );
}
