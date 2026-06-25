"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRepository = exports.ProductRepository = void 0;
const prisma_1 = require("../config/prisma");
class ProductRepository {
    async findAll(status) {
        return prisma_1.prisma.product.findMany({
            where: status ? { status } : undefined,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return prisma_1.prisma.product.findUnique({ where: { id } });
    }
    async create(data) {
        return prisma_1.prisma.product.create({ data });
    }
    async update(id, data) {
        return prisma_1.prisma.product.update({ where: { id }, data });
    }
    async delete(id) {
        return prisma_1.prisma.product.delete({ where: { id } });
    }
    async getDistinctCategories() {
        const products = await prisma_1.prisma.product.findMany({
            where: { status: 'Published' },
            select: { category: true },
            distinct: ['category'],
        });
        return products.map((p) => p.category);
    }
}
exports.ProductRepository = ProductRepository;
exports.productRepository = new ProductRepository();
//# sourceMappingURL=product.repository.js.map