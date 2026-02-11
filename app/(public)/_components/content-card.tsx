import Link from "next/link";
import { ArrowRight, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { isPdfUrl, normalizeAssetUrl } from "@/lib/media";

type ContentCardProps = {
  href: string;
  image?: string | null;
  title: string;
  description?: string | null;
  meta?: string;
  badge?: string;
};

export function ContentCard({
  href,
  image,
  title,
  description,
  meta,
  badge,
}: ContentCardProps) {
  const imageUrl = normalizeAssetUrl(image);
  const canRenderImage = Boolean(imageUrl) && !isPdfUrl(imageUrl);

  return (
    <Card className="group overflow-hidden rounded-2xl border-border/70 py-0 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 w-full overflow-hidden">
        {canRenderImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-accent/30 text-muted-foreground">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em]">
              <ImageOff className="size-4" />
              Visual Pending
            </div>
          </div>
        )}
      </div>
      <CardHeader className="gap-3 px-5 pt-5">
        <div className="flex items-center justify-between gap-2">
          {badge ? <Badge className="rounded-full">{badge}</Badge> : <span />}
          {meta ? <span className="text-xs text-muted-foreground">{meta}</span> : null}
        </div>
        <CardTitle className="line-clamp-2 text-lg leading-snug">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-5">
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {description || "Explore the full story with details and insights."}
        </p>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0">
        <Button asChild variant="outline" className="w-full rounded-xl">
          <Link href={href}>
            Read More
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
