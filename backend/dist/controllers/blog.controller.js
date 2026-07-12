"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogController = exports.BlogController = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const blog_service_1 = require("../services/blog.service");
const blog_validator_1 = require("../validators/blog.validator");
class BlogController {
    async getAllBlogs(req, res, next) {
        try {
            // If client requests published only, check query parameters. Else, default based on caller
            const publishedOnly = req.query.published === 'true';
            const blogs = await blog_service_1.blogService.getBlogs(publishedOnly);
            return res.status(200).json({
                success: true,
                data: blogs,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getBlogBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const blog = await blog_service_1.blogService.getBlogBySlug(slug);
            return res.status(200).json({
                success: true,
                data: blog,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createBlog(req, res, next) {
        let uploadedFile = req.file;
        try {
            // Validate schema (multer text fields are put in req.body)
            const validatedInput = blog_validator_1.createBlogSchema.parse(req.body);
            const imageUrl = req.body.featuredImageUrl || undefined;
            const blog = await blog_service_1.blogService.createBlog(validatedInput, uploadedFile ? uploadedFile.filename : undefined, imageUrl);
            return res.status(201).json({
                success: true,
                message: 'Blog post created successfully',
                data: blog,
            });
        }
        catch (error) {
            // Delete uploaded file if error occurred after upload to prevent orphaned files
            if (uploadedFile) {
                try {
                    fs_1.default.unlinkSync(path_1.default.join(__dirname, '../../uploads', uploadedFile.filename));
                }
                catch (err) {
                    console.error('❌ Failed to clean up upload file:', err);
                }
            }
            next(error);
        }
    }
    async updateBlog(req, res, next) {
        const { id } = req.params;
        let uploadedFile = req.file;
        try {
            const validatedInput = blog_validator_1.updateBlogSchema.parse(req.body);
            const blogId = parseInt(id, 10);
            if (isNaN(blogId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid blog ID format',
                });
            }
            // Pass imageUrl only if it was explicitly provided in the body
            const imageUrl = 'featuredImageUrl' in req.body ? (req.body.featuredImageUrl || '') : undefined;
            const blog = await blog_service_1.blogService.updateBlog(blogId, validatedInput, uploadedFile ? uploadedFile.filename : undefined, imageUrl);
            return res.status(200).json({
                success: true,
                message: 'Blog post updated successfully',
                data: blog,
            });
        }
        catch (error) {
            if (uploadedFile) {
                try {
                    fs_1.default.unlinkSync(path_1.default.join(__dirname, '../../uploads', uploadedFile.filename));
                }
                catch (err) {
                    console.error('❌ Failed to clean up upload file:', err);
                }
            }
            next(error);
        }
    }
    async deleteBlog(req, res, next) {
        try {
            const { id } = req.params;
            const blogId = parseInt(id, 10);
            if (isNaN(blogId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid blog ID format',
                });
            }
            await blog_service_1.blogService.deleteBlog(blogId);
            return res.status(200).json({
                success: true,
                message: 'Blog post deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BlogController = BlogController;
exports.blogController = new BlogController();
//# sourceMappingURL=blog.controller.js.map