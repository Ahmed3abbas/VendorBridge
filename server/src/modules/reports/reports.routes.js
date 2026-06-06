import { Router } from 'express';
import * as controller from './reports.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();

router.use(authenticate);

// All authenticated roles see dashboard (data is role-filtered in service)
router.get('/dashboard', requireRole('ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER', 'VENDOR'), controller.dashboard);

// Only Managers and Admins see financial reports
router.get('/spend-trend', requireRole('ADMIN', 'MANAGER'), controller.spendTrend);
router.get('/vendor-performance', requireRole('ADMIN', 'MANAGER'), controller.vendorPerformance);

export default router;
