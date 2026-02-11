import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentCard } from "../../_components/content-card";
import { ContentDetailLayout } from "../../_components/content-detail";
import { SectionHeader } from "../../_components/section-header";
import { getEventById, getRelatedEvents } from "@/lib/public-content";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  const related = await getRelatedEvents(event.id);

  return (
    <ContentDetailLayout
      backHref="/events"
      backLabel="Back to Events"
      image={event.bannerImage}
      title={event.title}
      description={event.location || (event.isOnline ? "Online event" : "In-person event")}
      dateLabel={new Date(event.startDate).toLocaleDateString()}
      category={event.isOnline ? "Online Event" : "In-person Event"}
      contentHtml={event.description}
    >
      <Card className="mt-10 rounded-2xl py-0">
        <CardHeader className="px-5 pt-5">
          <CardTitle className="text-xl">Event Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-5 pb-5 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Start:</span>{" "}
            {new Date(event.startDate).toLocaleString()}
          </p>
          {event.endDate ? (
            <p>
              <span className="font-semibold text-foreground">End:</span>{" "}
              {new Date(event.endDate).toLocaleString()}
            </p>
          ) : null}
          <p>
            <span className="font-semibold text-foreground">Location:</span>{" "}
            {event.location || (event.isOnline ? "Online" : "TBA")}
          </p>
          {event.eventUrl ? (
            <p>
              <a
                className="text-primary underline underline-offset-4"
                href={event.eventUrl}
                target="_blank"
                rel="noreferrer"
              >
                Event Registration Link
              </a>
            </p>
          ) : null}
        </CardContent>
      </Card>

      <div className="mt-12 space-y-5">
        <SectionHeader title="Related Content" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <ContentCard
              key={item.id}
              href={`/events/${item.id}`}
              image={item.bannerImage}
              title={item.title}
              description={item.location || (item.isOnline ? "Online event" : "In-person event")}
              meta={new Date(item.startDate).toLocaleDateString()}
            />
          ))}
        </div>
      </div>
    </ContentDetailLayout>
  );
}

