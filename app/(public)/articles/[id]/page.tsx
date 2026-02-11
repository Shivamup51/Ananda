import { notFound } from "next/navigation";
import { ContentCard } from "../../_components/content-card";
import { ContentDetailLayout } from "../../_components/content-detail";
import { SectionHeader } from "../../_components/section-header";
import { getArticleById, getRelatedArticles } from "@/lib/public-content";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ArticleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();

  const related = await getRelatedArticles(article.id);

  return (
    <ContentDetailLayout
      backHref="/articles"
      backLabel="Back to Articles"
      image={article.featuredImage}
      title={article.title}
      description={article.standfirst}
      author={article.author?.name}
      dateLabel={article.publishedAt?.toLocaleDateString()}
      category={article.category?.name || "Article"}
      contentHtml={article.content}
    >
      <div className="mt-12 space-y-5">
        <SectionHeader title="Related Content" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <ContentCard
              key={item.id}
              href={`/articles/${item.id}`}
              image={item.featuredImage}
              title={item.title}
              description={item.standfirst}
              meta={item.publishedAt?.toLocaleDateString()}
            />
          ))}
        </div>
      </div>
    </ContentDetailLayout>
  );
}

