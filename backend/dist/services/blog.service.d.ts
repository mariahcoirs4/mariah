import { CreateBlogInput, UpdateBlogInput } from '../validators/blog.validator';
export declare class BlogService {
    getBlogs(publishedOnly?: boolean): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        shortDescription: string;
        content: string;
        featuredImage: string | null;
        isPublished: boolean;
        canonicalUrl: string | null;
    }[]>;
    getBlogBySlug(slug: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        shortDescription: string;
        content: string;
        featuredImage: string | null;
        isPublished: boolean;
        canonicalUrl: string | null;
    }>;
    createBlog(input: CreateBlogInput, filename?: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        shortDescription: string;
        content: string;
        featuredImage: string | null;
        isPublished: boolean;
        canonicalUrl: string | null;
    }>;
    updateBlog(id: number, input: UpdateBlogInput, filename?: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        shortDescription: string;
        content: string;
        featuredImage: string | null;
        isPublished: boolean;
        canonicalUrl: string | null;
    }>;
    deleteBlog(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        shortDescription: string;
        content: string;
        featuredImage: string | null;
        isPublished: boolean;
        canonicalUrl: string | null;
    }>;
    private slugify;
    private generateUniqueSlug;
    private deleteImageFile;
}
export declare const blogService: BlogService;
