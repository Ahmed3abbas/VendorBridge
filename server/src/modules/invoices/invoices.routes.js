import { Router } from 'express';
import * as controller from './invoices.controller.js';
import activityLogger from '../../middlewares/activityLogger.middleware.js';

const router = Router();

router.post('/', activityLogger('CREATE_INVOICE', 'INVOICE'), controller.create);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.get('/:id/pdf', controller.downloadPDF);
router.post('/:id/send-email', activityLogger('SEND_INVOICE_EMAIL', 'INVOICE'), controller.sendInvoiceEmail);
router.put('/:id/status', activityLogger('UPDATE_INVOICE_STATUS', 'INVOICE'), controller.updateStatus);

export default router;
