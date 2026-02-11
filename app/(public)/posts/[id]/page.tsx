import { notFound } from "next/navigation";
import { ExternalLink, Globe, Newspaper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContentCard } from "../../_components/content-card";
import { ContentDetailLayout } from "../../_components/content-detail";
import { SectionHeader } from "../../_components/section-header";
import { getPostById, getRelatedPosts } from "@/lib/public-content";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  const related = await getRelatedPosts(post.id);

  return (
    <ContentDetailLayout
      backHref="/posts"
      backLabel="Back to Posts"
      image={post.logo}
      title={post.title}
      description={post.source || "Editorial post"}
      dateLabel={post.publishedAt?.toLocaleDateString()}
      category="Post"
      contentHtml={null}
    >
      <Card className="mt-10 rounded-2xl border py-0">
        <CardHeader className="px-5 pt-5">
          <CardTitle className="text-xl">Post Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-5 pb-5 text-sm leading-7 text-muted-foreground">
          <p>
            Posts are concise references and media mentions. This format stores title, source, link, and logo for
            streamlined publishing, instead of long-form body content.
          </p>
          {post.link ? (
            <Button asChild className="rounded-xl">
              <a href={post.link} target="_blank" rel="noreferrer">
                Visit Original Source
                <ExternalLink className="size-4" />
              </a>
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Card className="rounded-2xl py-0">
          <CardHeader className="px-5 pt-5">
            <CardTitle className="text-lg">Source</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 text-sm text-muted-foreground">
            <p className="inline-flex items-center gap-2">
              <Newspaper className="size-4 text-primary" />
              {post.source || "Not specified"}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl py-0">
          <CardHeader className="px-5 pt-5">
            <CardTitle className="text-lg">External Link</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 text-sm text-muted-foreground">
            {post.link ? (
              <a
                className="inline-flex items-center gap-2 text-primary underline underline-offset-4"
                href={post.link}
                target="_blank"
                rel="noreferrer"
              >
                <Globe className="size-4" />
                Open original post
              </a>
            ) : (
              <p>Not available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 space-y-5">
        <SectionHeader title="Related Posts" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {related.map((item: (typeof related)[number]) => (
            <ContentCard
              key={item.id}
              href={`/posts/${item.id}`}
              image={item.logo}
              title={item.title}
              description={item.source}
              meta={item.publishedAt?.toLocaleDateString()}
              badge="Post"
            />
          ))}
        </div>
      </div>
    </ContentDetailLayout>
  );
}
