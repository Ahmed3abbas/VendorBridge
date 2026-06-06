import { Router } from 'express';
import { listLogs } from './activityLogs.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();

router.use(authenticate, requireRole('ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER'));

router.get('/', listLogs);

export default router;
