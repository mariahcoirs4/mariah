import { Router } from 'express';
import { productController, uploadProductImages } from '../controllers/product.controller';
import { requireAdmin } from '../middleware/auth.middleware';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AdminPayload } from '../types';

const router = Router();

// Optionally attach admin info for GET routes
const optionalAdmin = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.admin = jwt.verify(token, env.JWT_SECRET) as AdminPayload;
    } catch (_) {}
  }
  next();
};

// Public + Admin routes
router.get('/categories', productController.getCategories);
router.get('/', optionalAdmin, productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin-only CRUD
router.post('/', requireAdmin, uploadProductImages, productController.createProduct);
router.put('/:id', requireAdmin, uploadProductImages, productController.updateProduct);
router.delete('/:id', requireAdmin, productController.deleteProduct);

export default router;
