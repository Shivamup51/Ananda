import prisma from "@/lib/prisma";

type SortDirection = "asc" | "desc";

export type QueryOptions = {
  q?: string;
  sort?: SortDirection;
};

const publishedFilter = {
  status: "PUBLISHED" as const,
  isEnabled: true,
};

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toParagraphHtml(value: string) {
  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return "";
  return lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}

function extractTextFromNode(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const record = node as Record<string, unknown>;

  const text = typeof record.text === "string" ? record.text : "";
  const content = Array.isArray(record.content)
    ? record.content.map(extractTextFromNode).join(" ")
    : "";

  return `${text} ${content}`.trim();
}

export function normalizeRichContent(value: unknown, fallback = ""): string {
  if (!value) return fallback;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    if (trimmed.startsWith("<")) return trimmed;

    try {
      const parsed = JSON.parse(trimmed) as unknown;
      const fromParsed = normalizeRichContent(parsed, "");
      return fromParsed || toParagraphHtml(trimmed) || fallback;
    } catch {
      return toParagraphHtml(trimmed) || fallback;
    }
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (typeof record.content === "string") {
      return normalizeRichContent(record.content, fallback);
    }

    if (typeof record.html === "string") {
      return normalizeRichContent(record.html, fallback);
    }

    if (typeof record.notes === "string") {
      return normalizeRichContent(record.notes, fallback);
    }

    const text = extractTextFromNode(record);
    if (text) return toParagraphHtml(text) || fallback;
  }

  return fallback;
}

export function extractSnippet(html: string | null | undefined, max = 140): string {
  if (!html) return "";
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}...`;
}

export const featuredIssues = [
  {
    id: "february-2026",
    title: "February 2026",
    issueDate: "February 2026",
    description: "A contemplative edition on focus, clarity, and practice.",
    flipbookUrl: "https://heyzine.com/flip-book/02634fdaa6.html",
  },
  {
    id: "january-2026",
    title: "January 2026",
    issueDate: "January 2026",
    description: "New year issue with essays on reset, rhythm, and intention.",
    flipbookUrl: "https://heyzine.com/flip-book/9d74cc1623.html",
  },
  {
    id: "december-2025",
    title: "December 2025",
    issueDate: "December 2025",
    description: "Year-end reflections and long-form guidance for mindful living.",
    flipbookUrl: "https://heyzine.com/flip-book/07980f1a7d.html",
  },
  {
    id: "november-2025",
    title: "November 2025",
    issueDate: "November 2025",
    description: "Foundational teachings with practical weekly routines.",
    flipbookUrl: "https://heyzine.com/flip-book/bd959516ec.html",
  },
] as const;

function queryFilter(q?: string) {
  if (!q?.trim()) return undefined;
  const query = q.trim();
  return [
    { title: { contains: query, mode: "insensitive" as const } },
    { slug: { contains: query, mode: "insensitive" as const } },
  ];
}

export async function getHomeData() {
  const [blogs, articles, posts, events, magazines] = await Promise.all([
    prisma.blog.findMany({
      where: publishedFilter,
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    prisma.article.findMany({
      where: publishedFilter,
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    prisma.pressItem.findMany({
      where: { isEnabled: true },
      orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
      take: 3,
    }),
    prisma.event.findMany({
      where: publishedFilter,
      orderBy: { startDate: "asc" },
      take: 3,
    }),
    prisma.magazineIssue.findMany({
      where: publishedFilter,
      orderBy: [{ year: "desc" }, { month: "desc" }],
      take: 3,
    }),
  ]);

  return {
    blogs: blogs.map((blog: (typeof blogs)[number]) => {
      const normalized = normalizeRichContent(blog.content);
      return {
        ...blog,
        content: normalized,
        excerpt: blog.excerpt || extractSnippet(normalized),
      };
    }),
    articles: articles.map((article: (typeof articles)[number]) => {
      const normalized = normalizeRichContent(article.content);
      return {
        ...article,
        content: normalized,
        standfirst: article.standfirst || extractSnippet(normalized),
      };
    }),
    posts,
    events: events.map((event: (typeof events)[number]) => ({
      ...event,
      description: normalizeRichContent(event.description),
    })),
    magazines,
  };
}

export async function getBlogs(options: QueryOptions) {
  const blogs = await prisma.blog.findMany({
    where: {
      ...publishedFilter,
      OR: queryFilter(options.q),
    },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
    },
    orderBy: { publishedAt: options.sort ?? "desc" },
    take: 60,
  });

  return blogs.map((blog: (typeof blogs)[number]) => {
    const normalized = normalizeRichContent(blog.content);
    return {
      ...blog,
      content: normalized,
      excerpt: blog.excerpt || extractSnippet(normalized),
    };
  });
}

export async function getArticles(options: QueryOptions) {
  const articles = await prisma.article.findMany({
    where: {
      ...publishedFilter,
      OR: queryFilter(options.q),
    },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
    },
    orderBy: { publishedAt: options.sort ?? "desc" },
    take: 60,
  });

  return articles.map((article: (typeof articles)[number]) => {
    const normalized = normalizeRichContent(article.content);
    return {
      ...article,
      content: normalized,
      standfirst: article.standfirst || extractSnippet(normalized),
    };
  });
}

export async function getPosts(options: QueryOptions) {
  return prisma.pressItem.findMany({
    where: {
      isEnabled: true,
      OR: options.q?.trim()
        ? [
            { title: { contains: options.q.trim(), mode: "insensitive" } },
            { source: { contains: options.q.trim(), mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: [{ publishedAt: options.sort ?? "desc" }, { id: "desc" }],
    take: 60,
  });
}

export async function getEvents(options: QueryOptions & { mode?: string }) {
  const events = await prisma.event.findMany({
    where: {
      ...publishedFilter,
      OR: queryFilter(options.q),
      isOnline:
        options.mode === "online"
          ? true
          : options.mode === "offline"
            ? false
            : undefined,
    },
    orderBy: { startDate: options.sort ?? "asc" },
    take: 60,
  });

  return events.map((event: (typeof events)[number]) => ({
    ...event,
    description: normalizeRichContent(event.description),
  }));
}

export async function getMagazines(options: QueryOptions & { year?: number }) {
  return prisma.magazineIssue.findMany({
    where: {
      ...publishedFilter,
      year: options.year,
      OR: queryFilter(options.q),
    },
    orderBy: [{ year: "desc" }, { month: "desc" }],
    take: 60,
  });
}

export async function getBlogById(id: string) {
  const blog = await prisma.blog.findFirst({
    where: {
      id,
      ...publishedFilter,
    },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
      tags: { select: { id: true, name: true } },
    },
  });

  if (!blog) return null;
  const normalized = normalizeRichContent(blog.content);

  return {
    ...blog,
    content: normalized,
    excerpt: blog.excerpt || extractSnippet(normalized),
  };
}

export async function getArticleById(id: string) {
  const article = await prisma.article.findFirst({
    where: {
      id,
      ...publishedFilter,
    },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
      tags: { select: { id: true, name: true } },
    },
  });

  if (!article) return null;
  const normalized = normalizeRichContent(article.content);

  return {
    ...article,
    content: normalized,
    standfirst: article.standfirst || extractSnippet(normalized),
  };
}

export async function getPostById(id: string) {
  return prisma.pressItem.findFirst({
    where: {
      id,
      isEnabled: true,
    },
  });
}

export async function getEventById(id: string) {
  const event = await prisma.event.findFirst({
    where: {
      id,
      ...publishedFilter,
    },
  });

  if (!event) return null;
  return {
    ...event,
    description: normalizeRichContent(event.description),
  };
}

export async function getMagazineById(id: string) {
  return prisma.magazineIssue.findFirst({
    where: {
      id,
      ...publishedFilter,
    },
    include: {
      highlights: true,
    },
  });
}

export async function getRelatedBlogs(exceptId: string) {
  const blogs = await prisma.blog.findMany({
    where: {
      ...publishedFilter,
      id: { not: exceptId },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return blogs.map((blog: (typeof blogs)[number]) => {
    const normalized = normalizeRichContent(blog.content);
    return {
      ...blog,
      content: normalized,
      excerpt: blog.excerpt || extractSnippet(normalized),
    };
  });
}

export async function getRelatedArticles(exceptId: string) {
  const articles = await prisma.article.findMany({
    where: {
      ...publishedFilter,
      id: { not: exceptId },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return articles.map((article: (typeof articles)[number]) => {
    const normalized = normalizeRichContent(article.content);
    return {
      ...article,
      content: normalized,
      standfirst: article.standfirst || extractSnippet(normalized),
    };
  });
}

export async function getRelatedPosts(exceptId: string) {
  return prisma.pressItem.findMany({
    where: {
      isEnabled: true,
      id: { not: exceptId },
    },
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    take: 3,
  });
}

export async function getRelatedEvents(exceptId: string) {
  const events = await prisma.event.findMany({
    where: {
      ...publishedFilter,
      id: { not: exceptId },
    },
    orderBy: { startDate: "asc" },
    take: 3,
  });

  return events.map((event: (typeof events)[number]) => ({
    ...event,
    description: normalizeRichContent(event.description),
  }));
}

export async function getRelatedMagazines(exceptId: string) {
  return prisma.magazineIssue.findMany({
    where: {
      ...publishedFilter,
      id: { not: exceptId },
    },
    orderBy: [{ year: "desc" }, { month: "desc" }],
    take: 3,
  });
}
