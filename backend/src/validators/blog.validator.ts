import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long').max(200),
  slug: z.string().max(200).optional().nullable(),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  focusKeywords: z.string().max(500).optional().nullable(),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters long').max(500),
  content: z.string().min(10, 'Content must be at least 10 characters long'),
  category: z.string().max(120).optional().nullable(),
  tags: z.string().max(500).optional().nullable(),
  authorName: z.string().max(120).optional().nullable(),
  authorRole: z.string().max(120).optional().nullable(),
  authorBio: z.string().max(1000).optional().nullable(),
  authorAvatar: z.string().url('Invalid avatar URL').optional().or(z.literal('')).nullable(),
  featuredImageAlt: z.string().max(160).optional().nullable(),
  isPublished: z.boolean().or(z.string().transform((val) => val === 'true')).optional().default(false),
  canonicalUrl: z.string().url('Invalid URL format').optional().or(z.literal('')).nullable(),
  featuredImageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')).nullable(),
});

export const updateBlogSchema = createBlogSchema.partial();

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
