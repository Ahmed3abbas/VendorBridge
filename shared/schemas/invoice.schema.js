import { z } from 'zod';

export const generateInvoiceSchema = z.object({
  poId: z.string().min(1),
  taxRate: z.number().min(0).max(100).optional().default(18),
});

export const invoiceStatusSchema = z.object({
  status: z.enum(['PAID', 'OVERDUE']),
});
