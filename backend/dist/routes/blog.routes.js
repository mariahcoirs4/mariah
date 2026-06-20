"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = require("../controllers/blog.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const router = (0, express_1.Router)();
// Middleware to optionally verify admin for GET listing
const optionalAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
            req.admin = decoded;
        }
        catch (e) {
            // Ignore token errors for optional check
        }
    }
    next();
};
router.get('/', optionalAdmin, (req, res, next) => {
    // If authenticated admin, retrieve all blogs. Else, only published.
    if (req.admin) {
        req.query.published = 'false'; // Admin gets everything
    }
    else {
        req.query.published = 'true'; // Public gets only published
    }
    blog_controller_1.blogController.getAllBlogs(req, res, next);
});
router.get('/:slug', blog_controller_1.blogController.getBlogBySlug);
// Admin CRUD routes
router.post('/', auth_middleware_1.requireAdmin, upload_middleware_1.upload.single('featuredImage'), blog_controller_1.blogController.createBlog);
router.put('/:id', auth_middleware_1.requireAdmin, upload_middleware_1.upload.single('featuredImage'), blog_controller_1.blogController.updateBlog);
router.delete('/:id', auth_middleware_1.requireAdmin, blog_controller_1.blogController.deleteBlog);
exports.default = router;
//# sourceMappingURL=blog.routes.js.map