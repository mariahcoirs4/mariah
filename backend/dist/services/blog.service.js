"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogService = exports.BlogService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const blog_repository_1 = require("../repositories/blog.repository");
class BlogService {
    async getBlogs(publishedOnly = false) {
        return blog_repository_1.blogRepository.findAll(publishedOnly);
    }
    async getBlogBySlug(slug) {
        const blog = await blog_repository_1.blogRepository.findBySlug(slug);
        if (!blog) {
            throw new Error('Blog post not found');
        }
        return blog;
    }
    async createBlog(input, filename, imageUrl) {
        const slug = await this.generateUniqueSlug(input.slug || input.title);
        // Prefer uploaded file; fall back to URL; fall back to null
        const featuredImage = filename ?? imageUrl ?? null;
        return blog_repository_1.blogRepository.create({
            title: input.title,
            slug,
            metaTitle: input.metaTitle || input.title,
            metaDescription: input.metaDescription || input.shortDescription,
            focusKeywords: input.focusKeywords || null,
            shortDescription: input.shortDescription,
            content: input.content,
            featuredImage,
            featuredImageAlt: input.featuredImageAlt || null,
            authorName: input.authorName || null,
            authorRole: input.authorRole || null,
            authorBio: input.authorBio || null,
            authorAvatar: input.authorAvatar || null,
            category: input.category || null,
            tags: input.tags || null,
            isPublished: input.isPublished ?? false,
            canonicalUrl: input.canonicalUrl || null,
        });
    }
    async updateBlog(id, input, filename, imageUrl) {
        const existing = await blog_repository_1.blogRepository.findById(id);
        if (!existing) {
            throw new Error('Blog post not found');
        }
        const updatedData = {};
        const assignIfDefined = (key, value) => {
            if (value !== undefined) {
                updatedData[key] = value === '' ? null : value;
            }
        };
        assignIfDefined('title', input.title);
        assignIfDefined('slug', input.slug);
        assignIfDefined('metaTitle', input.metaTitle);
        assignIfDefined('metaDescription', input.metaDescription);
        assignIfDefined('focusKeywords', input.focusKeywords);
        assignIfDefined('shortDescription', input.shortDescription);
        assignIfDefined('content', input.content);
        assignIfDefined('isPublished', input.isPublished);
        assignIfDefined('canonicalUrl', input.canonicalUrl);
        assignIfDefined('featuredImageAlt', input.featuredImageAlt);
        assignIfDefined('authorName', input.authorName);
        assignIfDefined('authorRole', input.authorRole);
        assignIfDefined('authorBio', input.authorBio);
        assignIfDefined('authorAvatar', input.authorAvatar);
        assignIfDefined('category', input.category);
        assignIfDefined('tags', input.tags);
        if (filename) {
            // New file uploaded — use it and delete the old file from disk (if it was a local file)
            updatedData.featuredImage = filename;
            if (existing.featuredImage && !existing.featuredImage.startsWith('http')) {
                this.deleteImageFile(existing.featuredImage);
            }
        }
        else if (imageUrl !== undefined) {
            // URL provided (may be empty string to clear)
            updatedData.featuredImage = imageUrl || null;
            // Delete old local file if switching to URL
            if (existing.featuredImage && !existing.featuredImage.startsWith('http')) {
                this.deleteImageFile(existing.featuredImage);
            }
        }
        // Handle slug updates or regenerate unique slug if slug changed
        if (input.slug && input.slug !== existing.slug) {
            updatedData.slug = await this.generateUniqueSlug(input.slug);
        }
        else if (input.title && !input.slug && this.slugify(input.title) !== existing.slug) {
            updatedData.slug = await this.generateUniqueSlug(input.title);
        }
        return blog_repository_1.blogRepository.update(id, updatedData);
    }
    async deleteBlog(id) {
        const existing = await blog_repository_1.blogRepository.findById(id);
        if (!existing) {
            throw new Error('Blog post not found');
        }
        // Only delete from disk if it's a local file (not an external URL)
        if (existing.featuredImage && !existing.featuredImage.startsWith('http')) {
            this.deleteImageFile(existing.featuredImage);
        }
        return blog_repository_1.blogRepository.delete(id);
    }
    slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }
    async generateUniqueSlug(text) {
        const baseSlug = this.slugify(text) || 'post';
        let slug = baseSlug;
        let counter = 1;
        while (true) {
            const existing = await blog_repository_1.blogRepository.findBySlug(slug);
            if (!existing) {
                return slug;
            }
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
    }
    deleteImageFile(filename) {
        try {
            const filePath = path_1.default.join(__dirname, '../../uploads', filename);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        }
        catch (error) {
            console.error(`❌ Failed to delete image file ${filename}:`, error);
        }
    }
}
exports.BlogService = BlogService;
exports.blogService = new BlogService();
//# sourceMappingURL=blog.service.js.map