import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';

// M1 routes
import authRoutes from './modules/auth/auth.routes.js';
import vendorRoutes from './modules/vendors/vendors.routes.js';
import rfqRoutes from './modules/rfq/rfq.routes.js';
import quotationRoutes from './modules/quotations/quotations.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// M1 routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/rfq', rfqRoutes);
app.use('/api', quotationRoutes); // /api/rfq/:rfqId/quotations + /api/quotations/:id

// === M2 ROUTES (uncomment after merge) ===
// import approvalsRoutes from './modules/approvals/approvals.routes.js';
// import poRoutes from './modules/purchase-orders/po.routes.js';
// import invoicesRoutes from './modules/invoices/invoices.routes.js';
// import activityLogsRoutes from './modules/activity-logs/activityLogs.routes.js';
// import reportsRoutes from './modules/reports/reports.routes.js';
// app.use('/api/approvals', approvalsRoutes);
// app.use('/api/purchase-orders', poRoutes);
// app.use('/api/invoices', invoicesRoutes);
// app.use('/api/activity-logs', activityLogsRoutes);
// app.use('/api/reports', reportsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use(errorHandler);

export default app;
