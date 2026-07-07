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
    async createBlog(input, filename) {
        const slug = await this.generateUniqueSlug(input.slug || input.title);
        return blog_repository_1.blogRepository.create({
            title: input.title,
            slug,
            metaTitle: input.metaTitle || input.title,
            metaDescription: input.metaDescription || input.shortDescription,
            shortDescription: input.shortDescription,
            content: input.content,
            featuredImage: filename || null,
            isPublished: input.isPublished ?? false,
            canonicalUrl: input.canonicalUrl || null,
        });
    }
    async updateBlog(id, input, filename) {
        const existing = await blog_repository_1.blogRepository.findById(id);
        if (!existing) {
            throw new Error('Blog post not found');
        }
        const updatedData = { ...input };
        // If new image is uploaded, delete the old featured image from disk
        if (filename) {
            updatedData.featuredImage = filename;
            if (existing.featuredImage) {
                this.deleteImageFile(existing.featuredImage);
            }
        }
        // Handle slug updates or regenerate unique slug if slug changed
        if (input.slug && input.slug !== existing.slug) {
            updatedData.slug = await this.generateUniqueSlug(input.slug);
        }
        else if (input.title && !input.slug && this.slugify(input.title) !== existing.slug) {
            // If title changed and slug not manually passed, generate new slug
            updatedData.slug = await this.generateUniqueSlug(input.title);
        }
        return blog_repository_1.blogRepository.update(id, updatedData);
    }
    async deleteBlog(id) {
        const existing = await blog_repository_1.blogRepository.findById(id);
        if (!existing) {
            throw new Error('Blog post not found');
        }
        // Delete featured image from disk
        if (existing.featuredImage) {
            this.deleteImageFile(existing.featuredImage);
        }
        return blog_repository_1.blogRepository.delete(id);
    }
    slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start
            .replace(/-+$/, ''); // Trim - from end
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