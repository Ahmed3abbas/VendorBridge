import { Router } from 'express';
import * as controller from './reports.controller.js';

const router = Router();

router.get('/dashboard', controller.dashboard);
router.get('/spend-trend', controller.spendTrend);
router.get('/vendor-performance', controller.vendorPerformance);

export default router;
