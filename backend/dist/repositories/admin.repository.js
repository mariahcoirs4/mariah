"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRepository = exports.AdminRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class AdminRepository {
    async findByEmail(email) {
        return prisma_1.default.admin.findUnique({
            where: { email },
        });
    }
    async findFirst() {
        return prisma_1.default.admin.findFirst();
    }
    async create(data) {
        return prisma_1.default.admin.create({
            data,
        });
    }
}
exports.AdminRepository = AdminRepository;
exports.adminRepository = new AdminRepository();
//# sourceMappingURL=admin.repository.js.map