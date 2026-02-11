import { ContentCard } from "../_components/content-card";
import { PaginationNav } from "../_components/pagination-nav";
import { SearchFilterBar } from "../_components/search-filter-bar";
import { SectionHeader } from "../_components/section-header";
import { getMagazines } from "@/lib/public-content";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MagazinesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const yearValue = typeof params.year === "string" ? Number(params.year) : undefined;
  const year = yearValue && Number.isFinite(yearValue) ? yearValue : undefined;
  const page = Math.max(1, Number(typeof params.page === "string" ? params.page : "1") || 1);
  const pageSize = 9;
  const magazines = await getMagazines({ q, year });
  const start = (page - 1) * pageSize;
  const pagedMagazines = magazines.slice(start, start + pageSize);
  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (year) query.set("year", String(year));

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Magazines"
        title="Published Magazine Issues"
        description="Flipbook-ready issues with immersive digital reading."
      />
      <div className="mt-6">
        <SearchFilterBar
          searchPlaceholder="Search magazine issues..."
          filterKey="year"
          filterOptions={[
            { value: "", label: "All Years" },
            { value: "2026", label: "2026" },
            { value: "2025", label: "2025" },
          ]}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {pagedMagazines.map((issue: (typeof pagedMagazines)[number]) => (
          <ContentCard
            key={issue.id}
            href={`/magazines/${issue.id}`}
            image={issue.coverImage}
            title={issue.title}
            description={issue.description}
            meta={`${issue.month}/${issue.year}`}
            badge="Magazine"
          />
        ))}
      </div>
      <PaginationNav
        currentPage={page}
        totalItems={magazines.length}
        pageSize={pageSize}
        basePath="/magazines"
        queryParams={query}
      />
    </section>
  );
}
