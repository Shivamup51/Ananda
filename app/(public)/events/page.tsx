import { ContentCard } from "../_components/content-card";
import { PaginationNav } from "../_components/pagination-nav";
import { SearchFilterBar } from "../_components/search-filter-bar";
import { SectionHeader } from "../_components/section-header";
import { getEvents } from "@/lib/public-content";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EventsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const mode = typeof params.mode === "string" ? params.mode : undefined;
  const page = Math.max(1, Number(typeof params.page === "string" ? params.page : "1") || 1);
  const pageSize = 9;
  const events = await getEvents({ q, mode, sort: "asc" });
  const start = (page - 1) * pageSize;
  const pagedEvents = events.slice(start, start + pageSize);
  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (mode) query.set("mode", mode);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Events"
        title="Upcoming Published Events"
        description="On-ground and online sessions with complete details."
      />
      <div className="mt-6">
        <SearchFilterBar
          searchPlaceholder="Search events..."
          filterKey="mode"
          filterOptions={[
            { value: "", label: "All Events" },
            { value: "online", label: "Online" },
            { value: "offline", label: "In Person" },
          ]}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {pagedEvents.map((event) => (
          <ContentCard
            key={event.id}
            href={`/events/${event.id}`}
            image={event.bannerImage}
            title={event.title}
            description={event.location || (event.isOnline ? "Online event" : "In-person event")}
            meta={new Date(event.startDate).toLocaleDateString()}
            badge={event.isOnline ? "Online" : "In Person"}
          />
        ))}
      </div>
      <PaginationNav
        currentPage={page}
        totalItems={events.length}
        pageSize={pageSize}
        basePath="/events"
        queryParams={query}
      />
    </section>
  );
}
