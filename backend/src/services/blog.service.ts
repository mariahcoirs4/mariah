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

  async createBlog(input: CreateBlogInput, filename?: string) {
    const slug = await this.generateUniqueSlug(input.slug || input.title);
    
    return blogRepository.create({
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

  async updateBlog(id: number, input: UpdateBlogInput, filename?: string) {
    const existing = await blogRepository.findById(id);
    if (!existing) {
      throw new Error('Blog post not found');
    }

    const updatedData: any = { ...input };

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
    } else if (input.title && !input.slug && this.slugify(input.title) !== existing.slug) {
      // If title changed and slug not manually passed, generate new slug
      updatedData.slug = await this.generateUniqueSlug(input.title);
    }

    return blogRepository.update(id, updatedData);
  }

  async deleteBlog(id: number) {
    const existing = await blogRepository.findById(id);
    if (!existing) {
      throw new Error('Blog post not found');
    }

    // Delete featured image from disk
    if (existing.featuredImage) {
      this.deleteImageFile(existing.featuredImage);
    }

    return blogRepository.delete(id);
  }

  private slugify(text: string): string {
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
