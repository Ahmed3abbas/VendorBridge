import { Router } from 'express';
import * as controller from './po.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import activityLogger from '../../middlewares/activityLogger.middleware.js';

const router = Router();

router.use(authenticate);

// Officers, Managers, Admins and Vendors (vendor sees only their own — scoped in service)
router.get('/', requireRole('ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER', 'VENDOR'), controller.listPOs);
router.get('/:id', requireRole('ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER', 'VENDOR'), controller.getPOById);
router.get('/:id/pdf', requireRole('ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER', 'VENDOR'), controller.downloadPDF);

// Only Officers and Admins can change PO status
router.put(
  '/:id/status',
  requireRole('ADMIN', 'PROCUREMENT_OFFICER'),
  activityLogger('UPDATE_PO_STATUS', 'PURCHASE_ORDER'),
  controller.updateStatus
);

export default router;
