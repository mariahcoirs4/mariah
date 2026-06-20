import { z } from 'zod';

export const createEnquirySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  companyName: z.string().max(100).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  productInterested: z.string().max(100).optional().nullable(),
  quantity: z.string().max(100).optional().nullable(),
  message: z.string().min(5, 'Message must be at least 5 characters long').max(2000),
  sourcePage: z.string().max(100).optional().nullable(),
});

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;
