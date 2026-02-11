"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  buildCloudinaryPdfPageImageUrl,
  isCloudinaryImagePdf,
  isPdfUrl,
  normalizeAssetUrl,
} from "@/lib/media";

type MagazineFlipbookProps = {
  title: string;
  issueDate: string;
  description?: string | null;
  flipbookUrl: string;
  pdfUrl?: string | null;
};

export function MagazineFlipbook({
  title,
  issueDate,
  description,
  flipbookUrl,
  pdfUrl,
}: MagazineFlipbookProps) {
  const normalizedFlipbook = normalizeAssetUrl(flipbookUrl);
  const normalizedPdf = normalizeAssetUrl(pdfUrl);
  const selectedUrl = normalizedFlipbook || normalizedPdf;

  const isHeyzine = selectedUrl.includes("heyzine.com/flip-book/");
  const isCloudinaryPdf = isCloudinaryImagePdf(selectedUrl);
  const isPdf = isPdfUrl(selectedUrl);

  const [pageImages, setPageImages] = useState<string[]>([]);
  const [activePage, setActivePage] = useState(1);
  const [loadingPages, setLoadingPages] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");

  const canFlip = pageImages.length > 0;
  const canUseCloudinaryFlip = isCloudinaryPdf && (loadingPages || canFlip);

  const currentPageUrl = useMemo(() => {
    if (!canFlip) return "";
    return pageImages[Math.max(0, activePage - 1)] || "";
  }, [activePage, canFlip, pageImages]);

  useEffect(() => {
    let cancelled = false;

    async function loadCloudinaryPdfPages() {
      if (!isCloudinaryPdf) return;

      setLoadingPages(true);
      const found: string[] = [];
      const maxPagesToProbe = 120;

      for (let page = 1; page <= maxPagesToProbe; page += 1) {
        const url = buildCloudinaryPdfPageImageUrl(selectedUrl, page);
        if (!url) break;

        const ok = await new Promise<boolean>((resolve) => {
          const image = new Image();
          image.onload = () => resolve(true);
          image.onerror = () => resolve(false);
          image.src = url;
        });

        if (!ok) break;
        found.push(url);
      }

      if (cancelled) return;
      setPageImages(found);
      setActivePage(1);
      setLoadingPages(false);
    }

    void loadCloudinaryPdfPages();
    return () => {
      cancelled = true;
    };
  }, [isCloudinaryPdf, selectedUrl]);

  function goPrev() {
    if (activePage <= 1) return;
    setFlipDirection("prev");
    setActivePage((value) => value - 1);
  }

  function goNext() {
    if (activePage >= pageImages.length) return;
    setFlipDirection("next");
    setActivePage((value) => value + 1);
  }

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          {issueDate}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
          {description || "Enjoy this issue in an immersive flipbook experience."}
        </p>
      </div>

      <div className="rounded-2xl border bg-gradient-to-br from-background via-muted/20 to-accent/20 p-3 shadow-xl shadow-primary/10 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl">
                  <Expand className="size-4" />
                  Fullscreen
                </Button>
              </DialogTrigger>
                <DialogContent
                  className="h-[95vh] max-w-[96vw] rounded-2xl p-3 sm:p-4"
                  showCloseButton
                >
                  <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                  </DialogHeader>
                  {isHeyzine ? (
                    <iframe
                      title={`${title} - Fullscreen`}
                      src={selectedUrl}
                      className="h-full w-full rounded-xl border"
                      allow="fullscreen"
                      loading="lazy"
                    />
                  ) : canUseCloudinaryFlip ? (
                    <div className="flex h-full flex-col gap-3">
                      <div className="flex items-center justify-between rounded-xl border bg-background px-3 py-2 text-sm">
                        <Button variant="outline" size="sm" onClick={goPrev} disabled={activePage <= 1}>
                          <ChevronLeft className="size-4" />
                          Prev
                        </Button>
                        <span>
                          Page {activePage} / {pageImages.length || 0}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goNext}
                          disabled={activePage >= pageImages.length}
                        >
                          Next
                          <ChevronRight className="size-4" />
                        </Button>
                      </div>
                      <div className="relative flex-1 overflow-hidden rounded-xl border bg-background">
                        {currentPageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={currentPageUrl}
                            src={currentPageUrl}
                            alt={`${title} page ${activePage}`}
                            className={`h-full w-full object-contain ${flipDirection === "next" ? "animate-in fade-in duration-300" : "animate-in slide-in-from-left-6 duration-300"}`}
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                            {loadingPages ? "Loading flipbook pages..." : "Opening PDF viewer..."}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <iframe
                      title={`${title} - Fullscreen`}
                      src={selectedUrl}
                      className="h-full w-full rounded-xl border"
                      allow="fullscreen"
                      loading="lazy"
                    />
                  )}
                </DialogContent>
              </Dialog>
            {selectedUrl ? (
              <Button asChild variant="outline" className="rounded-xl">
                <a href={selectedUrl} target="_blank" rel="noreferrer">
                  Open in New Tab
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            Navigation controls are available inside the flipbook viewer.
          </p>
        </div>
        {selectedUrl ? (
          isHeyzine ? (
            <iframe
              title={title}
              src={selectedUrl}
              className="h-[560px] w-full rounded-2xl border bg-background md:h-[700px]"
              allow="fullscreen"
              loading="lazy"
            />
          ) : canUseCloudinaryFlip ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border bg-background px-3 py-2 text-sm">
                <Button variant="outline" size="sm" onClick={goPrev} disabled={activePage <= 1}>
                  <ChevronLeft className="size-4" />
                  Prev
                </Button>
                <span>
                  Page {activePage} / {pageImages.length || 0}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goNext}
                  disabled={activePage >= pageImages.length}
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <div className="relative h-[560px] overflow-hidden rounded-2xl border bg-background md:h-[700px]">
                {currentPageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={currentPageUrl}
                    src={currentPageUrl}
                    alt={`${title} page ${activePage}`}
                    className={`h-full w-full object-contain ${flipDirection === "next" ? "animate-in fade-in duration-300" : "animate-in slide-in-from-left-6 duration-300"}`}
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    {loadingPages ? "Preparing flipbook pages..." : "Opening PDF viewer..."}
                  </div>
                )}
              </div>
            </div>
          ) : isPdf ? (
            <iframe
              title={`${title} PDF`}
              src={selectedUrl}
              className="h-[560px] w-full rounded-2xl border bg-background md:h-[700px]"
              loading="lazy"
            />
          ) : (
            <iframe
              title={`${title} Embedded`}
              src={selectedUrl}
              className="h-[560px] w-full rounded-2xl border bg-background md:h-[700px]"
              loading="lazy"
            />
          )
        ) : (
          <div className="flex h-[560px] items-center justify-center rounded-2xl border bg-background text-sm text-muted-foreground md:h-[700px]">
            No magazine file URL is configured for this issue yet.
          </div>
        )}
      </div>
    </section>
  );
}
