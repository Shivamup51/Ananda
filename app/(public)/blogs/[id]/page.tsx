import { notFound } from "next/navigation";
import { ContentCard } from "../../_components/content-card";
import { ContentDetailLayout } from "../../_components/content-detail";
import { SectionHeader } from "../../_components/section-header";
import { getBlogById, getRelatedBlogs } from "@/lib/public-content";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BlogDetailPage({ params }: PageProps) {
  const { id } = await params;
  const blog = await getBlogById(id);
  if (!blog) notFound();

  const related = await getRelatedBlogs(blog.id);

  return (
    <ContentDetailLayout
      backHref="/blogs"
      backLabel="Back to Blogs"
      image={blog.featuredImage}
      title={blog.title}
      description={blog.excerpt}
      author={blog.author?.name}
      dateLabel={blog.publishedAt?.toLocaleDateString()}
      category={blog.category?.name || "Blog"}
      contentHtml={blog.content}
    >
      <div className="mt-12 space-y-5">
        <SectionHeader title="Related Content" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <ContentCard
              key={item.id}
              href={`/blogs/${item.id}`}
              image={item.featuredImage}
              title={item.title}
              description={item.excerpt}
              meta={item.publishedAt?.toLocaleDateString()}
            />
          ))}
        </div>
      </div>
    </ContentDetailLayout>
  );
}

