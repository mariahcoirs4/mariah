"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_repository_1 = require("../repositories/admin.repository");
const env_1 = require("../config/env");
class AuthService {
    async login(email, password) {
        const admin = await admin_repository_1.adminRepository.findByEmail(email);
        if (!admin) {
            throw new Error('Invalid email or password');
        }
        const isMatch = await bcryptjs_1.default.compare(password, admin.password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }
        const payload = {
            id: admin.id,
            email: admin.email,
        };
        const options = {
            expiresIn: env_1.env.JWT_EXPIRES_IN,
        };
        return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, options);
    }
    async ensureDefaultAdminExists() {
        try {
            const existing = await admin_repository_1.adminRepository.findFirst();
            if (!existing) {
                console.log('⚡ No admin account detected. Creating default admin...');
                const hashedPassword = await bcryptjs_1.default.hash(env_1.env.ADMIN_PASSWORD, 10);
                await admin_repository_1.adminRepository.create({
                    email: env_1.env.ADMIN_EMAIL,
                    password: hashedPassword,
                });
                console.log(`✅ Default admin created successfully: ${env_1.env.ADMIN_EMAIL}`);
            }
        }
        catch (error) {
            console.error('❌ Failed to verify/create default admin account:', error);
        }
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map