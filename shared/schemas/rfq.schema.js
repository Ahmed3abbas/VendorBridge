import { z } from 'zod';

const rfqItemSchema = z.object({
  product_name: z.string().min(1, 'Product name is required'),
  quantity: z.number().positive('Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  description: z.string().optional().default(''),
});

export const rfqSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  description: z.string().optional().default(''),
  deadline: z.string().min(1, 'Deadline is required').refine((val) => {
    // Accept both ISO datetime strings and datetime-local format
    const date = new Date(val);
    return !isNaN(date.getTime()) && date > new Date();
  }, { message: 'Deadline must be a valid future date' }),
  items: z.array(rfqItemSchema).min(1, 'At least one item is required'),
  vendorIds: z.array(z.string().uuid('Invalid vendor ID')).min(1, 'At least one vendor must be selected'),
});
