import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { generatePDF } from '../../utils/generatePDF.js';
import * as service from './po.service.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PO_TEMPLATE = join(__dirname, '../../templates/po.html');

export const listPOs = asyncHandler(async (req, res) => {
  const { status, page, limit } = req.query;
  const result = await service.listPOs({
    status,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    userId: req.user.id,
    role: req.user.role,
  });
  const { data, total, ...pagination } = result;
  sendSuccess(res, data, 'Purchase orders retrieved', 200, { total, ...pagination });
});

export const getPOById = asyncHandler(async (req, res) => {
  const data = await service.getPOById(req.params.id);
  sendSuccess(res, data);
});

export const downloadPDF = asyncHandler(async (req, res) => {
  const po = await service.getPOById(req.params.id);
  const items = po.quotation.items
    .map((i) => `<tr><td>${i.rfqItem.description}</td><td>${i.quantity}</td><td>₹${i.unitPrice}</td><td>₹${i.subtotal}</td></tr>`)
    .join('');

  const buffer = await generatePDF(PO_TEMPLATE, {
    poNumber: po.poNumber,
    issuedAt: new Date(po.issuedAt).toLocaleDateString('en-IN'),
    vendorName: po.vendor.name,
    vendorEmail: po.vendor.email,
    vendorGST: po.vendor.gstNumber || 'N/A',
    rfqTitle: po.quotation.rfq.title,
    itemsRows: items,
    subtotal: po.subtotal.toFixed(2),
    taxRate: po.taxRate,
    taxAmount: po.taxAmount.toFixed(2),
    total: po.total.toFixed(2),
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${po.poNumber}.pdf"`);
  res.send(buffer);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const data = await service.updatePOStatus(req.params.id, req.body.status);
  sendSuccess(res, data, 'Status updated');
});
