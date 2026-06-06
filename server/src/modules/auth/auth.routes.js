import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { loginSchema, registerSchema } from '../../../../shared/schemas/auth.schema.js';
import * as ctrl from './auth.controller.js';
import { z } from 'zod';

const router = Router();

router.post('/register', validate(registerSchema), ctrl.register);
router.post('/login', validate(loginSchema), ctrl.login);
router.post('/refresh', validate(z.object({ refresh_token: z.string() })), ctrl.refresh);
router.post('/logout', authenticate, ctrl.logout);
router.post('/forgot-password', validate(z.object({ email: z.string().email() })), ctrl.forgotPassword);
router.post('/reset-password', validate(z.object({ email: z.string().email(), otp: z.string().length(6), newPassword: z.string().min(8) })), ctrl.resetPassword);

export default router;
