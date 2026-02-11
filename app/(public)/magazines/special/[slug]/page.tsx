import { notFound } from "next/navigation";
import { MagazineFlipbook } from "../../../_components/magazine-flipbook";
import { featuredIssues } from "@/lib/public-content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SpecialIssuePage({ params }: PageProps) {
  const { slug } = await params;
  const issue = featuredIssues.find((item) => item.id === slug);
  if (!issue) notFound();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <MagazineFlipbook
        title={issue.title}
        issueDate={issue.issueDate}
        description={issue.description}
        flipbookUrl={issue.flipbookUrl}
      />
    </section>
  );
}

