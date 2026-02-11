export function normalizeAssetUrl(value?: string | null) {
  if (!value) return "";

  let url = value.trim();
  if (!url) return "";

  // Remove accidental wrapping quotes.
  if (
    (url.startsWith('"') && url.endsWith('"')) ||
    (url.startsWith("'") && url.endsWith("'"))
  ) {
    url = url.slice(1, -1).trim();
  }

  if (!url) return "";

  // Avoid mixed-content issues in production.
  if (url.startsWith("http://")) {
    url = `https://${url.slice("http://".length)}`;
  }

  return url;
}

export function isPdfUrl(value?: string | null) {
  const url = normalizeAssetUrl(value);
  if (!url) return false;
  return /\.pdf(?:$|\?)/i.test(url) || url.includes("/raw/upload/");
}

export function isLikelyImageUrl(value?: string | null) {
  const url = normalizeAssetUrl(value);
  if (!url) return false;

  if (url.includes("/image/upload/")) return true;
  if (url.includes("/raw/upload/")) return false;

  return /\.(png|jpe?g|webp|gif|avif|svg)(?:$|\?)/i.test(url);
}

export function getPdfViewerUrl(value?: string | null) {
  const url = normalizeAssetUrl(value);
  if (!url) return "";
  return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(url)}`;
}

export function isCloudinaryImagePdf(value?: string | null) {
  const url = normalizeAssetUrl(value);
  if (!url) return false;
  return (
    url.includes("res.cloudinary.com") &&
    (url.includes("/image/upload/") || url.includes("/raw/upload/")) &&
    /\.pdf(?:$|\?)/i.test(url)
  );
}

export function buildCloudinaryPdfPageImageUrl(value: string, page: number) {
  const url = normalizeAssetUrl(value);
  if (!isCloudinaryImagePdf(url)) return "";

  const [base, query = ""] = url.split("?");
  const cloudinaryMatch = base.match(
    /^(https:\/\/res\.cloudinary\.com\/[^/]+)\/(?:image|raw)\/upload\/(.+)$/i,
  );
  if (!cloudinaryMatch) return "";

  const cloudinaryRoot = cloudinaryMatch[1];
  const tail = cloudinaryMatch[2];

  const withVersion =
    tail.match(/(?:^|\/)(v\d+\/.*)$/)?.[1] ??
    tail;

  const jpgPath = withVersion.replace(/\.pdf$/i, ".jpg");
  const transformed = `${cloudinaryRoot}/image/upload/pg_${page},f_auto,q_auto/${jpgPath}`;

  return query ? `${transformed}?${query}` : transformed;
}
