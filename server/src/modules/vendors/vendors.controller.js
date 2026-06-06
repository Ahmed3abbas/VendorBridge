import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse, paginatedResponse } from '../../utils/apiResponse.js';
import * as vendorService from './vendors.service.js';

export const list = asyncHandler(async (req, res) => {
  const { vendors, total, page, pages } = await vendorService.listVendors(req.query);
  paginatedResponse(res, vendors, { total, page, pages });
});

export const create = asyncHandler(async (req, res) => {
  const vendor = await vendorService.createVendor(req.body);
  successResponse(res, vendor, 'Vendor created', 201);
});

export const detail = asyncHandler(async (req, res) => {
  const vendor = await vendorService.getVendor(req.params.id);
  successResponse(res, vendor);
});

export const update = asyncHandler(async (req, res) => {
  const vendor = await vendorService.updateVendor(req.params.id, req.body);
  successResponse(res, vendor, 'Vendor updated');
});

export const performance = asyncHandler(async (req, res) => {
  const data = await vendorService.getVendorPerformance(req.params.id);
  successResponse(res, data);
});
