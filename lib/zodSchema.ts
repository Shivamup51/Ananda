import { z } from "zod";

export const articleStatusSchema = z.enum([
  "DRAFT",
  "REVIEW",
  "PUBLISHED",
  "ARCHIVED",
]);

export const articleContentSchema = z
  .string()
  .trim()
  .min(1, "Content is required.");

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug format is invalid.");

export const optionalUrlSchema = z
  .string()
  .trim()
  .url("URL must be valid.")
  .optional()
  .or(z.literal(""))
  .transform((value) => value || undefined);

export const articleInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required."),
  slug: slugSchema,
  standfirst: z
    .string()
    .trim()
    .min(1, "Standfirst is required."),
  content: articleContentSchema,
  featuredImage: z
    .string()
    .trim()
    .url("Featured image URL must be valid."),
  status: articleStatusSchema,
  isEnabled: z.boolean(),
  authorId: z
    .string()
    .trim()
    .min(1, "Author ID is required."),
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Tag cannot be empty."),
    )
    .min(1, "At least one tag is required.")
    .max(20, "A maximum of 20 tags is allowed."),
});

export type ArticleInputSchema = z.infer<typeof articleInputSchema>;

export const magazineInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  slug: slugSchema,
  theme: z.string().trim().optional(),
  month: z
    .number()
    .refine((value) => Number.isFinite(value), "Month must be a number.")
    .int("Month must be an integer.")
    .min(1, "Month must be between 1 and 12.")
    .max(12, "Month must be between 1 and 12."),
  year: z
    .number()
    .refine((value) => Number.isFinite(value), "Year must be a number.")
    .int("Year must be an integer.")
    .min(1900, "Year must be valid.")
    .max(2100, "Year must be valid."),
  coverImage: z.string().trim().url("Cover image URL must be valid."),
  description: z.string().trim().optional(),
  flipbookUrl: z.string().trim().url("Flipbook URL must be valid."),
  pdfUrl: optionalUrlSchema,
  status: articleStatusSchema,
  isEnabled: z.boolean(),
});

export type MagazineInputSchema = z.infer<typeof magazineInputSchema>;

export const blogInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  slug: slugSchema,
  excerpt: z.string().trim().optional(),
  content: z.string().trim().min(1, "Content is required."),
  featuredImage: optionalUrlSchema,
  status: articleStatusSchema,
  isEnabled: z.boolean(),
  authorId: z.string().trim().min(1, "Author ID is required."),
  tags: z
    .array(z.string().trim().min(1, "Tag cannot be empty."))
    .max(20, "A maximum of 20 tags is allowed.")
    .default([]),
});

export type BlogInputSchema = z.infer<typeof blogInputSchema>;

export const eventInputSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required."),
    slug: slugSchema,
    description: z.string().trim().min(1, "Description is required."),
    bannerImage: optionalUrlSchema,
    location: z.string().trim().optional(),
    isOnline: z.boolean(),
    eventUrl: optionalUrlSchema,
    startDate: z.string().trim().min(1, "Start date is required."),
    endDate: z.string().trim().optional(),
    status: articleStatusSchema,
    isEnabled: z.boolean(),
  })
  .superRefine((value, ctx) => {
    const start = new Date(value.startDate);
    if (Number.isNaN(start.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startDate"],
        message: "Start date is invalid.",
      });
    }

    if (value.endDate) {
      const end = new Date(value.endDate);
      if (Number.isNaN(end.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "End date is invalid.",
        });
        return;
      }
      if (!Number.isNaN(start.getTime()) && end < start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "End date cannot be earlier than start date.",
        });
      }
    }

    if (value.isOnline && !value.eventUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["eventUrl"],
        message: "Online events require an event URL.",
      });
    }
  });

export type EventInputSchema = z.infer<typeof eventInputSchema>;

export const pressInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  source: z.string().trim().optional(),
  link: optionalUrlSchema,
  logo: optionalUrlSchema,
  publishedAt: z.string().trim().optional(),
  isEnabled: z.boolean(),
});

export type PressInputSchema = z.infer<typeof pressInputSchema>;
