import { z } from 'zod';

const rfqItemSchema = z.object({
  product_name: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  description: z.string().optional(),
});

export const rfqSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  deadline: z.string().datetime(),
  items: z.array(rfqItemSchema).min(1),
  vendorIds: z.array(z.string()).min(1),
});
