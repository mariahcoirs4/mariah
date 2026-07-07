"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = exports.uploadProductImages = void 0;
const product_repository_1 = require("../repositories/product.repository");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const upload_middleware_1 = require("../middleware/upload.middleware");
// ─── Multer middleware for multiple product images ─────────────────
exports.uploadProductImages = upload_middleware_1.upload.array('images', 10);
class ProductController {
    // GET /api/products  (public: published only | admin: all)
    getAllProducts = async (req, res, next) => {
        try {
            const isAdmin = !!req.admin;
            const status = isAdmin ? undefined : 'Published';
            const products = await product_repository_1.productRepository.findAll(status);
            const parsed = products.map((p) => ({
                ...p,
                images: safeJsonParse(p.images, []),
                specs: safeJsonParse(p.specs, []),
            }));
            res.json({ success: true, data: parsed });
        }
        catch (err) {
            next(err);
        }
    };
    // GET /api/products/categories
    getCategories = async (req, res, next) => {
        try {
            const categories = await product_repository_1.productRepository.getDistinctCategories();
            res.json({ success: true, data: categories });
        }
        catch (err) {
            next(err);
        }
    };
    // GET /api/products/:id
    getProductById = async (req, res, next) => {
        try {
            const product = await product_repository_1.productRepository.findById(Number(req.params.id));
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
        }
        catch (err) {
            next(err);
        }
    };
    // POST /api/products  (admin only)
    createProduct = async (req, res, next) => {
        try {
            const { name, sku, category, moq, status, description, specs } = req.body;
            // Build image filenames from uploaded files
            const files = req.files ?? [];
            const images = files.map((f) => f.filename);
            const product = await product_repository_1.productRepository.create({
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
        }
        catch (err) {
            next(err);
        }
    };
    // PUT /api/products/:id  (admin only)
    updateProduct = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const existing = await product_repository_1.productRepository.findById(id);
            if (!existing) {
                res.status(404).json({ success: false, message: 'Product not found' });
                return;
            }
            const { name, sku, category, moq, status, description, specs, existingImages } = req.body;
            // Merge existing kept images with newly uploaded ones
            const kept = safeJsonParse(existingImages ?? '[]', []);
            const newFiles = req.files ?? [];
            const newFilenames = newFiles.map((f) => f.filename);
            const mergedImages = [...kept, ...newFilenames];
            // Delete images that are no longer used
            const previousImages = safeJsonParse(existing.images, []);
            const removed = previousImages.filter((img) => !kept.includes(img));
            for (const img of removed) {
                const imgPath = path_1.default.join(__dirname, '../../uploads', img);
                if (fs_1.default.existsSync(imgPath))
                    fs_1.default.unlinkSync(imgPath);
            }
            const product = await product_repository_1.productRepository.update(id, {
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
        }
        catch (err) {
            next(err);
        }
    };
    // DELETE /api/products/:id  (admin only)
    deleteProduct = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const existing = await product_repository_1.productRepository.findById(id);
            if (!existing) {
                res.status(404).json({ success: false, message: 'Product not found' });
                return;
            }
            // Clean up uploaded image files
            const images = safeJsonParse(existing.images, []);
            for (const img of images) {
                const imgPath = path_1.default.join(__dirname, '../../uploads', img);
                if (fs_1.default.existsSync(imgPath))
                    fs_1.default.unlinkSync(imgPath);
            }
            await product_repository_1.productRepository.delete(id);
            res.json({ success: true, message: 'Product deleted successfully' });
        }
        catch (err) {
            next(err);
        }
    };
}
function safeJsonParse(str, fallback) {
    try {
        return JSON.parse(str);
    }
    catch (_) {
        return fallback;
    }
}
exports.productController = new ProductController();
//# sourceMappingURL=product.controller.js.map