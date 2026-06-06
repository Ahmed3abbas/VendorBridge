import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { generatePDF } from '../../utils/generatePDF.js';
import * as service from './po.service.js';

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
    .map((i) => `<tr><td>${i.rfq_item.product_name}</td><td>${i.quantity}</td><td>₹${i.unit_price}</td><td>₹${i.subtotal}</td></tr>`)
    .join('');

  const buffer = await generatePDF('po.html', {
    poNumber: po.po_number,
    issuedAt: new Date(po.issued_at).toLocaleDateString('en-IN'),
    vendorName: po.vendor.name,
    vendorEmail: po.vendor.contact_email,
    vendorGST: po.vendor.gst_number || 'N/A',
    rfqTitle: po.quotation.rfq.title,
    itemsRows: items,
    subtotal: (po.total_amount - po.tax_amount).toFixed(2),
    taxRate: po.tax_rate,
    taxAmount: po.tax_amount.toFixed(2),
    total: po.total_amount.toFixed(2),
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${po.po_number}.pdf"`);
  res.send(buffer);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const data = await service.updatePOStatus(req.params.id, req.body.status);
  sendSuccess(res, data, 'Status updated');
});
