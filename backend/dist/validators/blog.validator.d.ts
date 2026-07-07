import { z } from 'zod';
export declare const createBlogSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    metaTitle: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    metaDescription: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    shortDescription: z.ZodString;
    content: z.ZodString;
    isPublished: z.ZodDefault<z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodEffects<z.ZodString, boolean, string>]>>>;
    canonicalUrl: z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    shortDescription: string;
    content: string;
    isPublished: boolean;
    slug?: string | null | undefined;
    metaTitle?: string | null | undefined;
    metaDescription?: string | null | undefined;
    canonicalUrl?: string | null | undefined;
}, {
    title: string;
    shortDescription: string;
    content: string;
    slug?: string | null | undefined;
    metaTitle?: string | null | undefined;
    metaDescription?: string | null | undefined;
    isPublished?: string | boolean | undefined;
    canonicalUrl?: string | null | undefined;
}>;
export declare const updateBlogSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    metaTitle: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    metaDescription: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    shortDescription: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    isPublished: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodEffects<z.ZodString, boolean, string>]>>>>;
    canonicalUrl: z.ZodOptional<z.ZodNullable<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    slug?: string | null | undefined;
    metaTitle?: string | null | undefined;
    metaDescription?: string | null | undefined;
    shortDescription?: string | undefined;
    content?: string | undefined;
    isPublished?: boolean | undefined;
    canonicalUrl?: string | null | undefined;
}, {
    title?: string | undefined;
    slug?: string | null | undefined;
    metaTitle?: string | null | undefined;
    metaDescription?: string | null | undefined;
    shortDescription?: string | undefined;
    content?: string | undefined;
    isPublished?: string | boolean | undefined;
    canonicalUrl?: string | null | undefined;
}>;
export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
