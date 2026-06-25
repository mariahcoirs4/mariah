"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enquiryRepository = exports.EnquiryRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class EnquiryRepository {
    async create(data) {
        return prisma_1.default.enquiry.create({
            data,
        });
    }
    async findAll(filter = {}) {
        const where = {};
        if (filter.search) {
            const searchLower = filter.search;
            where.OR = [
                { name: { contains: searchLower } },
                { companyName: { contains: searchLower } },
                { email: { contains: searchLower } },
                { phone: { contains: searchLower } },
                { country: { contains: searchLower } },
                { productInterested: { contains: searchLower } },
                { message: { contains: searchLower } },
            ];
        }
        if (filter.startDate || filter.endDate) {
            where.createdAt = {};
            if (filter.startDate) {
                where.createdAt.gte = filter.startDate;
            }
            if (filter.endDate) {
                where.createdAt.lte = filter.endDate;
            }
        }
        return prisma_1.default.enquiry.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    async delete(id) {
        return prisma_1.default.enquiry.delete({
            where: { id },
        });
    }
    async count() {
        return prisma_1.default.enquiry.count();
    }
    async findRecent(limit = 5) {
        return prisma_1.default.enquiry.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }
}
exports.EnquiryRepository = EnquiryRepository;
exports.enquiryRepository = new EnquiryRepository();
//# sourceMappingURL=enquiry.repository.js.map