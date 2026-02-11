import { notFound } from "next/navigation";
import { ContentCard } from "../../_components/content-card";
import { MagazineFlipbook } from "../../_components/magazine-flipbook";
import { SectionHeader } from "../../_components/section-header";
import { getMagazineById, getRelatedMagazines } from "@/lib/public-content";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MagazineIssuePage({ params }: PageProps) {
  const { id } = await params;
  const issue = await getMagazineById(id);
  if (!issue) notFound();

  const related = await getRelatedMagazines(issue.id);

  return (
    <section className="mx-auto w-full max-w-6xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      <MagazineFlipbook
        title={issue.title}
        issueDate={`${issue.month}/${issue.year}`}
        description={issue.description}
        flipbookUrl={issue.flipbookUrl}
        pdfUrl={issue.pdfUrl}
      />

      {issue.highlights.length ? (
        <div className="space-y-4 rounded-2xl border bg-card p-6">
          <SectionHeader title="Issue Highlights" />
          <div className="grid gap-4 md:grid-cols-2">
            {issue.highlights.map((highlight: (typeof issue.highlights)[number]) => (
              <div key={highlight.id} className="rounded-xl border bg-background p-4">
                <p className="font-semibold">{highlight.title}</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{highlight.summary}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-5">
        <SectionHeader title="Related Content" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {related.map((item: (typeof related)[number]) => (
            <ContentCard
              key={item.id}
              href={`/magazines/${item.id}`}
              image={item.coverImage}
              title={item.title}
              description={item.description}
              meta={`${item.month}/${item.year}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
