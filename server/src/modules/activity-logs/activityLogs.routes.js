import { Router } from 'express';
import { listLogs } from './activityLogs.controller.js';

const router = Router();

router.get('/', listLogs);

export default router;
