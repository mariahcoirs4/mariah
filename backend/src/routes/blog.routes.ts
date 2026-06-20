import { Router } from 'express';
import { blogController } from '../controllers/blog.controller';
import { requireAdmin } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AdminPayload } from '../types';

const router = Router();

// Middleware to optionally verify admin for GET listing
const optionalAdmin = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as AdminPayload;
      req.admin = decoded;
    } catch (e) {
      // Ignore token errors for optional check
    }
  }
  next();
};

router.get('/', optionalAdmin, (req: any, res: any, next: any) => {
  // If authenticated admin, retrieve all blogs. Else, only published.
  if (req.admin) {
    req.query.published = 'false'; // Admin gets everything
  } else {
    req.query.published = 'true'; // Public gets only published
  }
  blogController.getAllBlogs(req, res, next);
});

router.get('/:slug', blogController.getBlogBySlug);

// Admin CRUD routes
router.post('/', requireAdmin, upload.single('featuredImage'), blogController.createBlog);
router.put('/:id', requireAdmin, upload.single('featuredImage'), blogController.updateBlog);
router.delete('/:id', requireAdmin, blogController.deleteBlog);

export default router;
