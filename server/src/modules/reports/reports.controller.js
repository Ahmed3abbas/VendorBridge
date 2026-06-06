import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import * as service from './reports.service.js';

export const dashboard = asyncHandler(async (req, res) => {
  const data = await service.getDashboard({ userId: req.user.id, role: req.user.role });
  sendSuccess(res, data, 'Dashboard data');
});

export const spendTrend = asyncHandler(async (req, res) => {
  const data = await service.getSpendTrend();
  sendSuccess(res, data, 'Spend trend');
});

export const vendorPerformance = asyncHandler(async (req, res) => {
  const data = await service.getVendorPerformance();
  sendSuccess(res, data, 'Vendor performance');
});
