"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRepository = exports.BlogRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class BlogRepository {
    async findAll(publishedOnly = false) {
        return prisma_1.default.blog.findMany({
            where: publishedOnly ? { isPublished: true } : {},
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return prisma_1.default.blog.findUnique({
            where: { id },
        });
    }
    async findBySlug(slug) {
        return prisma_1.default.blog.findUnique({
            where: { slug },
        });
    }
    async create(data) {
        return prisma_1.default.blog.create({
            data,
        });
    }
    async update(id, data) {
        return prisma_1.default.blog.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return prisma_1.default.blog.delete({
            where: { id },
        });
    }
    async count(publishedOnly = false) {
        return prisma_1.default.blog.count({
            where: publishedOnly ? { isPublished: true } : {},
        });
    }
    async findRecent(limit = 5) {
        return prisma_1.default.blog.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }
}
exports.BlogRepository = BlogRepository;
exports.blogRepository = new BlogRepository();
//# sourceMappingURL=blog.repository.js.map