"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const router = (0, express_1.Router)();
// Optionally attach admin info for GET routes
const optionalAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            req.admin = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        }
        catch (_) { }
    }
    next();
};
// Public + Admin routes
router.get('/categories', product_controller_1.productController.getCategories);
router.get('/', optionalAdmin, product_controller_1.productController.getAllProducts);
router.get('/:id', product_controller_1.productController.getProductById);
// Admin-only CRUD
router.post('/', auth_middleware_1.requireAdmin, product_controller_1.uploadProductImages, product_controller_1.productController.createProduct);
router.put('/:id', auth_middleware_1.requireAdmin, product_controller_1.uploadProductImages, product_controller_1.productController.updateProduct);
router.delete('/:id', auth_middleware_1.requireAdmin, product_controller_1.productController.deleteProduct);
exports.default = router;
//# sourceMappingURL=product.routes.js.map