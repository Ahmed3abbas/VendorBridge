import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env.js';
import errorHandler from './middlewares/errorHandler.js';
import authenticate from './middlewares/auth.middleware.js';

// M1 routes
import authRoutes from './modules/auth/auth.routes.js';
import vendorRoutes from './modules/vendors/vendors.routes.js';
import rfqRoutes from './modules/rfq/rfq.routes.js';
import quotationRoutes from './modules/quotations/quotations.routes.js';

// M2 routes
import approvalsRoutes from './modules/approvals/approvals.routes.js';
import poRoutes from './modules/purchase-orders/po.routes.js';
import invoicesRoutes from './modules/invoices/invoices.routes.js';
import activityLogsRoutes from './modules/activity-logs/activityLogs.routes.js';
import reportsRoutes from './modules/reports/reports.routes.js';

const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public
app.use('/api/auth', authRoutes);

// Protected
app.use('/api/vendors', authenticate, vendorRoutes);
app.use('/api/rfqs', authenticate, rfqRoutes);
app.use('/api/quotations', authenticate, quotationRoutes);
app.use('/api/approvals', authenticate, approvalsRoutes);
app.use('/api/purchase-orders', authenticate, poRoutes);
app.use('/api/invoices', authenticate, invoicesRoutes);
app.use('/api/activity-logs', authenticate, activityLogsRoutes);
app.use('/api/reports', authenticate, reportsRoutes);

app.use(errorHandler);

export default app;
