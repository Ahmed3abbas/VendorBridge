import { Router } from 'express';
import * as controller from './po.controller.js';
import activityLogger from '../../middlewares/activityLogger.middleware.js';

const router = Router();

router.get('/', controller.listPOs);
router.get('/:id', controller.getPOById);
router.get('/:id/pdf', controller.downloadPDF);
router.put('/:id/status', activityLogger('UPDATE_PO_STATUS', 'PURCHASE_ORDER'), controller.updateStatus);

export default router;
