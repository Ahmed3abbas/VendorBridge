import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import * as service from './approvals.service.js';

export const listPending = asyncHandler(async (req, res) => {
  const data = await service.listPending();
  sendSuccess(res, data, 'Pending approvals');
});

export const getById = asyncHandler(async (req, res) => {
  const data = await service.getApprovalById(req.params.id);
  sendSuccess(res, data);
});

export const approve = asyncHandler(async (req, res) => {
  const data = await service.approveQuotation(req.params.id, {
    remarks: req.body.remarks,
    actedById: req.user.id,
  });
  sendSuccess(res, data, 'Quotation approved and PO generated');
});

export const reject = asyncHandler(async (req, res) => {
  const data = await service.rejectQuotation(req.params.id, {
    remarks: req.body.remarks,
    actedById: req.user.id,
  });
  sendSuccess(res, data, 'Quotation rejected');
});
