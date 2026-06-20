"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogSchema = exports.createBlogSchema = void 0;
const zod_1 = require("zod");
exports.createBlogSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Title must be at least 3 characters long').max(200),
    slug: zod_1.z.string().max(200).optional().nullable(),
    metaTitle: zod_1.z.string().max(200).optional().nullable(),
    metaDescription: zod_1.z.string().max(500).optional().nullable(),
    shortDescription: zod_1.z.string().min(10, 'Short description must be at least 10 characters long').max(500),
    content: zod_1.z.string().min(10, 'Content must be at least 10 characters long'),
    isPublished: zod_1.z.boolean().or(zod_1.z.string().transform((val) => val === 'true')).optional().default(false),
    canonicalUrl: zod_1.z.string().url('Invalid URL format').optional().or(zod_1.z.literal('')).nullable(),
});
exports.updateBlogSchema = exports.createBlogSchema.partial();
//# sourceMappingURL=blog.validator.js.map