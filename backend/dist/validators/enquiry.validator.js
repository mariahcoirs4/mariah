"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnquirySchema = void 0;
const zod_1 = require("zod");
exports.createEnquirySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100),
    email: zod_1.z.string().email('Invalid email address'),
    companyName: zod_1.z.string().max(100).optional().nullable(),
    phone: zod_1.z.string().max(30).optional().nullable(),
    country: zod_1.z.string().max(100).optional().nullable(),
    productInterested: zod_1.z.string().max(100).optional().nullable(),
    quantity: zod_1.z.string().max(100).optional().nullable(),
    message: zod_1.z.string().min(5, 'Message must be at least 5 characters long').max(2000),
    sourcePage: zod_1.z.string().max(100).optional().nullable(),
});
//# sourceMappingURL=enquiry.validator.js.map