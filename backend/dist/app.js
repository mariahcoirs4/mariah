"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const auth_service_1 = require("./services/auth.service");
const error_middleware_1 = require("./middleware/error.middleware");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const blog_routes_1 = __importDefault(require("./routes/blog.routes"));
const enquiry_routes_1 = __importDefault(require("./routes/enquiry.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const prisma_1 = __importDefault(require("./config/prisma"));
const app = (0, express_1.default)();
// Render/Vercel sit behind a reverse proxy — required for rate limiting and req.ip
app.set('trust proxy', 1);
// ─── Security Middleware ──────────────────────────────────────────
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// ─── Global Rate Limiter ──────────────────────────────────────────
const globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    message: { success: false, message: 'Too many requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
// Stricter limit for enquiry submissions (anti-spam)
const enquiryLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: { success: false, message: 'Too many enquiry submissions. Please try again in an hour.' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip ?? 'unknown',
});
app.use(globalLimiter);
// ─── Body Parsers ─────────────────────────────────────────────────
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// ─── Static File Serving for Uploads ─────────────────────────────
const uploadsDir = path_1.default.join(__dirname, '../uploads');
app.use('/uploads', express_1.default.static(uploadsDir, {
    maxAge: '7d',
    etag: true,
}));
// ─── Health Check ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Mariah Coirs API is running ✅',
        timestamp: new Date().toISOString(),
        environment: env_1.env.NODE_ENV,
    });
});
// ─── API Routes ──────────────────────────────────────────────────
app.use('/api/auth', auth_routes_1.default);
app.use('/api/blogs', blog_routes_1.default);
app.use('/api/enquiries', enquiryLimiter, enquiry_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/products', product_routes_1.default);
// ─── 404 Handler ─────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`,
    });
});
// ─── Global Error Handler ────────────────────────────────────────
app.use(error_middleware_1.errorHandler);
// ─── Start Server ────────────────────────────────────────────────
async function main() {
    // Ensure default admin exists on startup
    await auth_service_1.authService.ensureDefaultAdminExists();
    const server = app.listen(env_1.env.PORT, () => {
        console.log(`\n🚀 Mariah Coirs API running at http://localhost:${env_1.env.PORT}`);
        console.log(`📁 Uploads served at http://localhost:${env_1.env.PORT}/uploads`);
        console.log(`🌐 CORS: all origins allowed`);
        console.log(`📦 Environment: ${env_1.env.NODE_ENV}\n`);
    });
    const shutdown = async (signal) => {
        console.log(`\n${signal} received — shutting down gracefully`);
        server.close(async () => {
            await prisma_1.default.$disconnect();
            process.exit(0);
        });
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}
if (!process.env.VERCEL) {
    main().catch((err) => {
        console.error('❌ Fatal startup error:', err);
        process.exit(1);
    });
}
exports.default = app;
//# sourceMappingURL=app.js.map