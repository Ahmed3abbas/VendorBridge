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
      
      // Convert quantity to number for each item
      req.body.items = req.body.items.map(item => ({
        ...item,
        quantity: parseFloat(item.quantity) || 0
      }));
    }
    
    // Parse vendor_ids array from JSON string and rename to vendorIds
    if (req.body.vendor_ids && typeof req.body.vendor_ids === 'string') {
      req.body.vendorIds = JSON.parse(req.body.vendor_ids);
      delete req.body.vendor_ids;
    }
    
    // Ensure deadline is in proper format
    if (req.body.deadline) {
      // datetime-local gives format like "2024-12-25T14:30"
      // Convert to ISO string if not already
      const deadlineDate = new Date(req.body.deadline);
      if (!isNaN(deadlineDate.getTime())) {
        req.body.deadline = deadlineDate.toISOString();
      }
    }
    
    next();
  } catch (error) {
    // If parsing fails, let validation catch the error
    next();
  }
};

router.get('/', allAuth, ctrl.list);
router.post('/', officerOnly, upload.array('attachments', 5), parseRFQFormData, validate(rfqSchema), ctrl.create);
router.get('/:id', allAuth, ctrl.detail);
router.put('/:id', officerOnly, validate(rfqSchema.partial()), ctrl.update);
router.post('/:id/close', officerOnly, ctrl.close);

export default router;
