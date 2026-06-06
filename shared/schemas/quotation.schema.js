import { z } from 'zod';

const quotationItemSchema = z.object({
  rfq_item_id: z.string(),
  unit_price: z.number().positive(),
  quantity: z.number().positive(),
  subtotal: z.number().positive(),
});

export const quotationSchema = z.object({
  items: z.array(quotationItemSchema).min(1),
  total_amount: z.number().positive(),
  delivery_date: z.string().datetime(),
  notes: z.string().optional(),
});
