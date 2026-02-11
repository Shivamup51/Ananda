import Link from "next/link";
import { ArrowLeft, Calendar, Share2, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isPdfUrl, normalizeAssetUrl } from "@/lib/media";

type DetailLayoutProps = {
  backHref: string;
  backLabel: string;
  image?: string | null;
  title: string;
  description?: string | null;
  author?: string | null;
  dateLabel?: string | null;
  category?: string | null;
  contentHtml?: string | null;
  children?: React.ReactNode;
};

export function ContentDetailLayout({
  backHref,
  backLabel,
  image,
  title,
  description,
  author,
  dateLabel,
  category,
  contentHtml,
  children,
}: DetailLayoutProps) {
  const imageUrl = normalizeAssetUrl(image);
  const canRenderImage = Boolean(imageUrl) && !isPdfUrl(imageUrl);

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Button asChild variant="ghost" className="mb-4 gap-2">
        <Link href={backHref}>
          <ArrowLeft className="size-4" />
          {backLabel}
        </Link>
      </Button>

      <div className="overflow-hidden rounded-3xl border shadow-lg">
        <div className="h-64 w-full bg-gradient-to-br from-muted to-accent/40 md:h-96">
          {canRenderImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : null}
        </div>
      </div>

      <div className="mt-7 space-y-4">
        {category ? <Badge className="rounded-full">{category}</Badge> : null}
        <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
        {description ? (
          <p className="text-base leading-8 text-muted-foreground md:text-lg">{description}</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {author ? (
            <p className="inline-flex items-center gap-2">
              <UserRound className="size-4" />
              {author}
            </p>
          ) : null}
          {dateLabel ? (
            <p className="inline-flex items-center gap-2">
              <Calendar className="size-4" />
              {dateLabel}
            </p>
          ) : null}
          <button type="button" className="inline-flex items-center gap-2 hover:text-foreground">
            <Share2 className="size-4" />
            Share
          </button>
        </div>
      </div>

      {contentHtml ? (
        <article className="prose-area mt-10 max-w-none rounded-2xl border bg-card p-6 md:p-10">
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </article>
      ) : null}

      {children}
    </section>
  );
}
