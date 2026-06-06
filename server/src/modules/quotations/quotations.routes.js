import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { quotationSchema } from '../../../../shared/schemas/quotation.schema.js';
import * as ctrl from './quotations.controller.js';

const router = Router();
router.use(authenticate);

router.post('/rfq/:rfqId/quotations', requireRole('VENDOR'), validate(quotationSchema), ctrl.submit);
router.get('/rfq/:rfqId/quotations', requireRole('ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER'), ctrl.listForRFQ);
router.put('/quotations/:id', requireRole('VENDOR'), ctrl.update);
router.post('/quotations/:id/select', requireRole('ADMIN', 'PROCUREMENT_OFFICER'), ctrl.select);

export default router;
