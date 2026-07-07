"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
// Load environmental variables from the root .env of backend
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().default(5000),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:5173'),
    DATABASE_URL: zod_1.z.string().min(1, 'DATABASE_URL is required'),
    DIRECT_URL: zod_1.z.string().min(1, 'DIRECT_URL is required'),
    JWT_SECRET: zod_1.z.string().min(8, 'JWT_SECRET must be at least 8 characters'),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    ADMIN_EMAIL: zod_1.z.string().email('Invalid ADMIN_EMAIL format'),
    ADMIN_PASSWORD: zod_1.z.string().min(6, 'ADMIN_PASSWORD must be at least 6 characters'),
    SMTP_HOST: zod_1.z.string().min(1).optional(),
    SMTP_PORT: zod_1.z.coerce.number().int().positive().default(587),
    SMTP_SECURE: zod_1.z.enum(['true', 'false']).default('false').transform((value) => value === 'true'),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASSWORD: zod_1.z.string().optional(),
    EMAIL_FROM: zod_1.z.string().optional(),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('❌ Invalid environment configuration:', parsed.error.format());
    process.exit(1);
}
exports.env = parsed.data;
exports.default = exports.env;
//# sourceMappingURL=env.js.map