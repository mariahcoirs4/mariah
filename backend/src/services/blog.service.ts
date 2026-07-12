import fs from 'fs';
import path from 'path';
import { blogRepository } from '../repositories/blog.repository';
import { CreateBlogInput, UpdateBlogInput } from '../validators/blog.validator';

export class BlogService {
  async getBlogs(publishedOnly = false) {
    return blogRepository.findAll(publishedOnly);
  }

  async getBlogBySlug(slug: string) {
    const blog = await blogRepository.findBySlug(slug);
    if (!blog) {
      throw new Error('Blog post not found');
    }
    return blog;
  }

  async createBlog(input: CreateBlogInput, filename?: string, imageUrl?: string) {
    const slug = await this.generateUniqueSlug(input.slug || input.title);

    // Prefer uploaded file; fall back to URL; fall back to null
    const featuredImage = filename ?? imageUrl ?? null;

    return blogRepository.create({
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

  async updateBlog(id: number, input: UpdateBlogInput, filename?: string, imageUrl?: string) {
    const existing = await blogRepository.findById(id);
    if (!existing) {
      throw new Error('Blog post not found');
    }

    const updatedData: any = {};

    const assignIfDefined = (key: keyof UpdateBlogInput, value: unknown) => {
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
    } else if (imageUrl !== undefined) {
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
    } else if (input.title && !input.slug && this.slugify(input.title) !== existing.slug) {
      updatedData.slug = await this.generateUniqueSlug(input.title);
    }

    return blogRepository.update(id, updatedData);
  }

  async deleteBlog(id: number) {
    const existing = await blogRepository.findById(id);
    if (!existing) {
      throw new Error('Blog post not found');
    }

    // Only delete from disk if it's a local file (not an external URL)
    if (existing.featuredImage && !existing.featuredImage.startsWith('http')) {
      this.deleteImageFile(existing.featuredImage);
    }

    return blogRepository.delete(id);
  }

  private slugify(text: string): string {
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

  private async generateUniqueSlug(text: string): Promise<string> {
    const baseSlug = this.slugify(text) || 'post';
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await blogRepository.findBySlug(slug);
      if (!existing) {
        return slug;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  private deleteImageFile(filename: string) {
    try {
      const filePath = path.join(__dirname, '../../uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`❌ Failed to delete image file ${filename}:`, error);
    }
  }
}

export const blogService = new BlogService();

