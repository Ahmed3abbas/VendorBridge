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

// Middleware to parse FormData JSON fields for RFQ creation
const parseRFQFormData = (req, res, next) => {
  try {
    // Parse items array from JSON string
    if (req.body.items && typeof req.body.items === 'string') {
      req.body.items = JSON.parse(req.body.items);
    }
    if (Array.isArray(req.body.items)) {
      req.body.items = req.body.items.map(item => ({
        ...item,
        quantity: parseFloat(item.quantity) || 0,
      }));
    }

    // Parse vendor_ids → vendorIds (handle both JSON string and plain array)
    const raw = req.body.vendor_ids;
    if (raw) {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      req.body.vendorIds = Array.isArray(parsed) ? parsed : [parsed];
      delete req.body.vendor_ids;
    }

    // Normalise deadline to ISO string
    if (req.body.deadline) {
      const d = new Date(req.body.deadline);
      if (!isNaN(d.getTime())) req.body.deadline = d.toISOString();
    }

    next();
  } catch (error) {
    next(error);
  }
};

router.get('/', allAuth, ctrl.list);
router.post('/', officerOnly, upload.array('attachments', 5), parseRFQFormData, validate(rfqSchema), ctrl.create);
router.get('/:id', allAuth, ctrl.detail);
router.put('/:id', officerOnly, validate(rfqSchema.partial()), ctrl.update);
router.post('/:id/close', officerOnly, ctrl.close);

export default router;
