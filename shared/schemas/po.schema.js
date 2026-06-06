import { z } from 'zod';

export const poStatusSchema = z.object({
  status: z.enum(['ACKNOWLEDGED', 'COMPLETED', 'CANCELLED']),
});
