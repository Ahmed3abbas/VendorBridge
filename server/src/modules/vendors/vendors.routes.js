import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { vendorSchema } from '../../../../shared/schemas/vendor.schema.js';
import * as ctrl from './vendors.controller.js';

const router = Router();
router.use(authenticate);

const officerPlus = requireRole('ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER');
const adminOnly = requireRole('ADMIN');

router.get('/', officerPlus, ctrl.list);
router.post('/', adminOnly, validate(vendorSchema), ctrl.create);
router.get('/:id', officerPlus, ctrl.detail);
router.put('/:id', adminOnly, validate(vendorSchema.partial()), ctrl.update);
router.get('/:id/performance', requireRole('ADMIN', 'MANAGER'), ctrl.performance);

export default router;
