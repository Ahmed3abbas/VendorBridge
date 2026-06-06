import { z } from 'zod';

export const approveSchema = z.object({
  remarks: z.string().max(500).optional(),
});

export const rejectSchema = z.object({
  remarks: z.string().min(1, 'Remarks required for rejection').max(500),
});
