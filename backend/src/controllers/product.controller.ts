import { Request, Response, NextFunction } from 'express';
import { productRepository } from '../repositories/product.repository';
import path from 'path';
import fs from 'fs';
import { upload } from '../middleware/upload.middleware';

// ─── Multer middleware for multiple product images ─────────────────
export const uploadProductImages = upload.array('images', 10);

class ProductController {
  // GET /api/products  (public: published only | admin: all)
  getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isAdmin = !!(req as any).admin;
      const status = isAdmin ? undefined : 'Published';
      const products = await productRepository.findAll(status);

      const parsed = products.map((p) => ({
        ...p,
        images: safeJsonParse(p.images, []),
        specs: safeJsonParse(p.specs, []),
      }));

      res.json({ success: true, data: parsed });
    } catch (err) {
      next(err);
    }
  };

  // GET /api/products/categories
  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await productRepository.getDistinctCategories();
      res.json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  };

  // GET /api/products/:id
  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productRepository.findById(Number(req.params.id));
      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }
      res.json({
        success: true,
        data: {
          ...product,
          images: safeJsonParse(product.images, []),
          specs: safeJsonParse(product.specs, []),
        },
      });
    } catch (err) {
      next(err);
    }
  };

  // POST /api/products  (admin only)
  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, sku, category, moq, status, description, specs } = req.body;

      // Build image list: uploaded files + explicit URL strings
      const files = (req.files as Express.Multer.File[]) ?? [];
      const uploadedFilenames = files.map((f) => f.filename);
      const urlImages: string[] = safeJsonParse(req.body.imageUrls ?? '[]', []);
      const images = [...urlImages, ...uploadedFilenames];

      const product = await productRepository.create({
        name: name?.trim() ?? '',
        sku: sku?.trim() ?? '',
        category: category?.trim() ?? '',
        moq: moq?.trim() ?? '',
        status: status ?? 'Draft',
        description: description?.trim() ?? '',
        images: JSON.stringify(images),
        specs: specs ?? '[]',
      });

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { ...product, images, specs: safeJsonParse(product.specs, []) },
      });
    } catch (err) {
      next(err);
    }
  };

  // PUT /api/products/:id  (admin only)
  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const existing = await productRepository.findById(id);
      if (!existing) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      const { name, sku, category, moq, status, description, specs, existingImages } = req.body;

      // Merge kept existing images + new URL images + newly uploaded files
      const kept: string[] = safeJsonParse(existingImages ?? '[]', []);
      const newUrlImages: string[] = safeJsonParse(req.body.imageUrls ?? '[]', []);
      const newFiles = (req.files as Express.Multer.File[]) ?? [];
      const newFilenames = newFiles.map((f) => f.filename);
      const mergedImages = [...kept, ...newUrlImages, ...newFilenames];

      // Delete local files that are no longer used (skip URL-based images)
      const previousImages: string[] = safeJsonParse(existing.images, []);
      const removed = previousImages.filter((img) => !kept.includes(img));
      for (const img of removed) {
        if (!img.startsWith('http')) {
          const imgPath = path.join(__dirname, '../../uploads', img);
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }
      }

      const product = await productRepository.update(id, {
        name: name?.trim(),
        sku: sku?.trim(),
        category: category?.trim(),
        moq: moq?.trim(),
        status,
        description: description?.trim(),
        images: JSON.stringify(mergedImages),
        specs: specs ?? '[]',
      });

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: {
          ...product,
          images: mergedImages,
          specs: safeJsonParse(product.specs, []),
        },
      });
    } catch (err) {
      next(err);
    }
  };

  // DELETE /api/products/:id  (admin only)
  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const existing = await productRepository.findById(id);
      if (!existing) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      // Clean up only local uploaded files (skip URL-based images)
      const images: string[] = safeJsonParse(existing.images, []);
      for (const img of images) {
        if (!img.startsWith('http')) {
          const imgPath = path.join(__dirname, '../../uploads', img);
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }
      }

      await productRepository.delete(id);
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
      next(err);
    }
  };
}

function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
  } catch (_) {
    return fallback;
  }
}

export const productController = new ProductController();

