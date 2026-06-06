import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse, paginatedResponse } from '../../utils/apiResponse.js';
import * as rfqService from './rfq.service.js';

export const list = asyncHandler(async (req, res) => {
  const { rfqs, total, page, pages } = await rfqService.listRFQs(req.user, req.query);
  paginatedResponse(res, rfqs, { total, page, pages });
});

export const create = asyncHandler(async (req, res) => {
  const rfq = await rfqService.createRFQ(req.body, req.user.id);
  successResponse(res, rfq, 'RFQ created', 201);
});

export const detail = asyncHandler(async (req, res) => {
  const rfq = await rfqService.getRFQ(req.params.id, req.user);
  successResponse(res, rfq);
});

export const update = asyncHandler(async (req, res) => {
  const rfq = await rfqService.updateRFQ(req.params.id, req.body, req.user.id);
  successResponse(res, rfq, 'RFQ updated');
});

export const close = asyncHandler(async (req, res) => {
  const rfq = await rfqService.closeRFQ(req.params.id, req.user.id);
  successResponse(res, rfq, 'RFQ closed');
});
