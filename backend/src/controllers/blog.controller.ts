import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { blogService } from '../services/blog.service';
import { createBlogSchema, updateBlogSchema } from '../validators/blog.validator';

export class BlogController {
  async getAllBlogs(req: Request, res: Response, next: NextFunction) {
    try {
      // If client requests published only, check query parameters. Else, default based on caller
      const publishedOnly = req.query.published === 'true';
      const blogs = await blogService.getBlogs(publishedOnly);
      return res.status(200).json({
        success: true,
        data: blogs,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBlogBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const blog = await blogService.getBlogBySlug(slug);
      return res.status(200).json({
        success: true,
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  async createBlog(req: Request, res: Response, next: NextFunction) {
    let uploadedFile = req.file;

    try {
      // Validate schema (multer text fields are put in req.body)
      const validatedInput = createBlogSchema.parse(req.body);
      
      const blog = await blogService.createBlog(
        validatedInput,
        uploadedFile ? uploadedFile.filename : undefined
      );

      return res.status(201).json({
        success: true,
        message: 'Blog post created successfully',
        data: blog,
      });
    } catch (error) {
      // Delete uploaded file if error occurred after upload to prevent orphaned files
      if (uploadedFile) {
        try {
          fs.unlinkSync(path.join(__dirname, '../../uploads', uploadedFile.filename));
        } catch (err) {
          console.error('❌ Failed to clean up upload file:', err);
        }
      }
      next(error);
    }
  }

  async updateBlog(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    let uploadedFile = req.file;

    try {
      const validatedInput = updateBlogSchema.parse(req.body);
      const blogId = parseInt(id, 10);
      if (isNaN(blogId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid blog ID format',
        });
      }

      const blog = await blogService.updateBlog(
        blogId,
        validatedInput,
        uploadedFile ? uploadedFile.filename : undefined
      );

      return res.status(200).json({
        success: true,
        message: 'Blog post updated successfully',
        data: blog,
      });
    } catch (error) {
      if (uploadedFile) {
        try {
          fs.unlinkSync(path.join(__dirname, '../../uploads', uploadedFile.filename));
        } catch (err) {
          console.error('❌ Failed to clean up upload file:', err);
        }
      }
      next(error);
    }
  }

  async deleteBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const blogId = parseInt(id, 10);
      if (isNaN(blogId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid blog ID format',
        });
      }

      await blogService.deleteBlog(blogId);
      return res.status(200).json({
        success: true,
        message: 'Blog post deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const blogController = new BlogController();
