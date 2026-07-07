import { PrismaClient } from '@prisma/client';
declare const prisma: PrismaClient<{
    log: ["query", "info", "warn", "error"] | ["error"];
}, never, import("@prisma/client/runtime/library").DefaultArgs>;
export default prisma;
export { prisma };
