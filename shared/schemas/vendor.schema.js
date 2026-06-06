import { z } from 'zod';

export const vendorSchema = z.object({
  name: z.string().min(2).max(200),
  gst_number: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number'),
  category: z.string().min(1),
  status: z.enum(['ACTIVE', 'INACTIVE', 'BLACKLISTED']).default('ACTIVE'),
  contact_email: z.string().email(),
  contact_phone: z.string().min(10).max(15),
  address: z.string().optional(),
  user_id: z.string().optional(),
});
