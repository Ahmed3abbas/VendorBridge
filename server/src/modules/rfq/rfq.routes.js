import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { upload } from '../../middlewares/upload.middleware.js';
import { rfqSchema } from '../../../../shared/schemas/rfq.schema.js';
import * as ctrl from './rfq.controller.js';

const router = Router();
router.use(authenticate);

const officerOnly = requireRole('ADMIN', 'PROCUREMENT_OFFICER');
const allAuth = requireRole('ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER', 'VENDOR');

router.get('/', allAuth, ctrl.list);
router.post('/', officerOnly, upload.array('attachments', 5), validate(rfqSchema), ctrl.create);
router.get('/:id', allAuth, ctrl.detail);
router.put('/:id', officerOnly, validate(rfqSchema.partial()), ctrl.update);
router.post('/:id/close', officerOnly, ctrl.close);

export default router;
