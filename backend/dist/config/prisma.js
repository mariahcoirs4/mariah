"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
});
exports.prisma = prisma;
const disconnect = () => prisma.$disconnect();
process.on('SIGINT', async () => {
    await disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await disconnect();
    process.exit(0);
});
exports.default = prisma;
//# sourceMappingURL=prisma.js.map