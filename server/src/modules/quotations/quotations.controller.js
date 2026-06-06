import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import * as quotationService from './quotations.service.js';

export const submit = asyncHandler(async (req, res) => {
  const q = await quotationService.submitQuotation(req.params.rfqId, req.body, req.user.id);
  successResponse(res, q, 'Quotation submitted', 201);
});

export const listForRFQ = asyncHandler(async (req, res) => {
  const data = await quotationService.getQuotationsForRFQ(req.params.rfqId);
  successResponse(res, data);
});

export const update = asyncHandler(async (req, res) => {
  const q = await quotationService.updateQuotation(req.params.id, req.body, req.user.id);
  successResponse(res, q, 'Quotation updated');
});

export const select = asyncHandler(async (req, res) => {
  const data = await quotationService.selectQuotation(req.params.id, req.user.id);
  successResponse(res, data, 'Quotation selected — approval pending');
});
