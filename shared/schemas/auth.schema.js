import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/, 'Must contain uppercase').regex(/[0-9]/, 'Must contain number'),
  role: z.enum(['ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER', 'VENDOR']).default('PROCUREMENT_OFFICER'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
