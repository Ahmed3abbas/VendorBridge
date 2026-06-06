import { Router } from 'express';
import * as controller from './invoices.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import activityLogger from '../../middlewares/activityLogger.middleware.js';

const router = Router();

router.use(authenticate);

// Officers and Admins can generate invoices
router.post('/', requireRole('ADMIN', 'PROCUREMENT_OFFICER'), activityLogger('CREATE_INVOICE', 'INVOICE'), controller.create);

// Officers, Managers, Admins can view — Vendors scoped in service
router.get('/', requireRole('ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER', 'VENDOR'), controller.list);
router.get('/:id', requireRole('ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER', 'VENDOR'), controller.getById);
router.get('/:id/pdf', requireRole('ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER', 'VENDOR'), controller.downloadPDF);

// Only Officers and Admins can send email or update status
router.post('/:id/send-email', requireRole('ADMIN', 'PROCUREMENT_OFFICER'), activityLogger('SEND_INVOICE_EMAIL', 'INVOICE'), controller.sendInvoiceEmail);
router.put('/:id/status', requireRole('ADMIN', 'PROCUREMENT_OFFICER'), activityLogger('UPDATE_INVOICE_STATUS', 'INVOICE'), controller.updateStatus);

export default router;
