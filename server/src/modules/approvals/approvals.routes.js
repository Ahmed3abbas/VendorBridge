import { Router } from 'express';
import * as controller from './approvals.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import activityLogger from '../../middlewares/activityLogger.middleware.js';

const router = Router();

router.use(authenticate, requireRole('ADMIN', 'MANAGER'));

router.get('/', controller.listPending);
router.get('/:id', controller.getById);
router.post('/:id/approve', activityLogger('APPROVE_QUOTATION', 'APPROVAL'), controller.approve);
router.post('/:id/reject', activityLogger('REJECT_QUOTATION', 'APPROVAL'), controller.reject);

export default router;
