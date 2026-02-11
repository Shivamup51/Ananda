import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  HeartHandshake,
  Library,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContentCard } from "./_components/content-card";
import { SectionHeader } from "./_components/section-header";
import { featuredIssues, getHomeData } from "@/lib/public-content";

const pillars = [
  {
    id: "01",
    title: "Mindful Leadership",
    description:
      "Leadership as an inner practice rooted in awareness, ethics, and calm clarity.",
    icon: Compass,
  },
  {
    id: "02",
    title: "Well-Being",
    description:
      "Body, mind, and soul in practical harmony through reflection and conscious choices.",
    icon: HeartHandshake,
  },
  {
    id: "03",
    title: "Conscious Living",
    description:
      "A grounded way of being that supports meaningful work, relationships, and growth.",
    icon: BookOpen,
  },
];

export default async function HomePage() {
  const { blogs, articles, posts, magazines } = await getHomeData();
  const currentIssue = featuredIssues[0];

  return (
    <div className="bg-background text-foreground">
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden border-b">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_16%,theme(colors.primary/14),transparent_33%),linear-gradient(to_bottom,theme(colors.background),theme(colors.muted/30),theme(colors.background))]" />
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-20 text-center sm:px-6">
          <Image
            src="/logo.png"
            alt="Anandda"
            width={94}
            height={94}
            className="mb-7 rounded-2xl border"
            priority
          />
          <Badge className="mb-4 rounded-full px-4 py-1 text-xs tracking-wide">
            Global Digital Monthly Magazine
          </Badge>
          <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
            Mindful leadership, well-being, and conscious living for modern
            life.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            Anandda is a reflective editorial space where inner awareness meets
            lived experience through carefully curated writing, interviews, and
            monthly digital editions.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-xl">
              <Link href="/login">
                Get Started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl">
              <Link href="/about">About Anandda</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Editorial Vision
            </p>
            <h2 className="text-balance text-3xl font-semibold sm:text-4xl">
              A publication designed to accompany, not overwhelm.
            </h2>
            <p className="text-sm leading-8 text-muted-foreground sm:text-base">
              We publish stories and reflections that help readers pause, think
              deeply, and carry practical awareness into work, relationships,
              and daily choices. The tone is calm, clear, and deeply human.
            </p>
            <Button asChild variant="link" className="px-0">
              <Link href="/about">Read our philosophy</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {pillars.map((pillar) => (
              <Card key={pillar.title} className="rounded-2xl py-0">
                <CardContent className="space-y-3 px-4 py-5">
                  <p className="text-xs font-semibold tracking-[0.12em] text-primary">
                    {pillar.id}
                  </p>
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/12 text-primary">
                    <pillar.icon className="size-4" />
                  </div>
                  <h3 className="text-base font-semibold">{pillar.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {pillar.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="relative min-h-[360px] overflow-hidden rounded-3xl border">
            <Image
              src="/WhatsApp Image 2025-12-21 at 6.26.09 PM.jpeg"
              alt="Featured issue"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Current Edition
            </p>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              {currentIssue.title}
            </h2>
            <p className="text-sm leading-8 text-muted-foreground sm:text-base">
              {currentIssue.description} Access the latest issue in an immersive
              digital experience and explore thoughtful perspectives for
              leadership and conscious living.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-xl">
                <Link href={`/magazines/special/${currentIssue.id}`}>
                  Open Issue
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <a
                  href={currentIssue.flipbookUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Flipbook
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <SectionHeader title="Latest Blogs" />
            <Button asChild variant="link" className="px-0">
              <Link href="/blogs">View all</Link>
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <ContentCard
                key={blog.id}
                href={`/blogs/${blog.id}`}
                image={blog.featuredImage}
                title={blog.title}
                description={blog.excerpt}
                meta={blog.publishedAt?.toLocaleDateString()}
                badge="Blog"
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <SectionHeader title="Latest Articles" />
            <Button asChild variant="link" className="px-0">
              <Link href="/articles">View all</Link>
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ContentCard
                key={article.id}
                href={`/articles/${article.id}`}
                image={article.featuredImage}
                title={article.title}
                description={article.standfirst}
                meta={article.publishedAt?.toLocaleDateString()}
                badge="Article"
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <SectionHeader title="Latest Posts" />
            <Button asChild variant="link" className="px-0">
              <Link href="/posts">View all</Link>
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <ContentCard
                key={post.id}
                href={`/posts/${post.id}`}
                image={post.logo}
                title={post.title}
                description={post.source || "Editorial post"}
                meta={post.publishedAt?.toLocaleDateString()}
                badge="Post"
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <SectionHeader title="Featured Magazines" />
            <Button asChild variant="link" className="px-0">
              <Link href="/magazines">View all</Link>
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {magazines.map((issue) => (
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
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Stay Connected
            </p>
            <h3 className="text-2xl font-semibold sm:text-3xl">
              Begin your next mindful read.
            </h3>
          </div>
          <Button asChild size="lg" className="rounded-xl">
            <Link href="/contact">
              Connect With Anandda
              <Library className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
