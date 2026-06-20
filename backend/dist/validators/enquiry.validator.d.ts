import { z } from 'zod';
export declare const createEnquirySchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    companyName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    country: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    productInterested: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    quantity: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    message: z.ZodString;
    sourcePage: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    message: string;
    email: string;
    name: string;
    companyName?: string | null | undefined;
    phone?: string | null | undefined;
    country?: string | null | undefined;
    productInterested?: string | null | undefined;
    quantity?: string | null | undefined;
    sourcePage?: string | null | undefined;
}, {
    message: string;
    email: string;
    name: string;
    companyName?: string | null | undefined;
    phone?: string | null | undefined;
    country?: string | null | undefined;
    productInterested?: string | null | undefined;
    quantity?: string | null | undefined;
    sourcePage?: string | null | undefined;
}>;
export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;
