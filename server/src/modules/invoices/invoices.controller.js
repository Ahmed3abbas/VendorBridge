import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { generatePDF } from '../../utils/generatePDF.js';
import { sendEmail } from '../../utils/sendEmail.js';
import * as service from './invoices.service.js';

export const create = asyncHandler(async (req, res) => {
  const data = await service.generateInvoice(req.body);
  sendSuccess(res, data, 'Invoice generated', 201);
});

export const list = asyncHandler(async (req, res) => {
  const { status, page, limit } = req.query;
  const result = await service.listInvoices({ status, page: parseInt(page) || 1, limit: parseInt(limit) || 20 });
  const { data, total, ...pagination } = result;
  sendSuccess(res, data, 'Invoices retrieved', 200, { total, ...pagination });
});

export const getById = asyncHandler(async (req, res) => {
  const data = await service.getInvoiceById(req.params.id, { userId: req.user.id, role: req.user.role });
  sendSuccess(res, data);
});

export const downloadPDF = asyncHandler(async (req, res) => {
  const invoice = await service.getInvoiceById(req.params.id, { userId: req.user.id, role: req.user.role });
  const po = invoice.purchase_order;
  const items = po.quotation.items
    .map((i) => `<tr><td>${i.rfq_item.product_name}</td><td>${i.quantity}</td><td>₹${i.unit_price}</td><td>₹${i.subtotal}</td></tr>`)
    .join('');

  const cgst = (invoice.tax_amount / 2).toFixed(2);
  const buffer = await generatePDF('invoice.html', {
    invoiceNumber: invoice.invoice_number,
    invoiceDate: new Date(invoice.created_at).toLocaleDateString('en-IN'),
    dueDate: 'N/A',
    vendorName: po.vendor.name,
    vendorEmail: po.vendor.contact_email,
    vendorGST: po.vendor.gst_number || 'N/A',
    itemsRows: items,
    subtotal: invoice.subtotal.toFixed(2),
    cgst,
    sgst: cgst,
    total: invoice.total.toFixed(2),
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${invoice.invoice_number}.pdf"`);
  res.send(buffer);
});

export const sendInvoiceEmail = asyncHandler(async (req, res) => {
  const invoice = await service.getInvoiceById(req.params.id, { userId: req.user.id, role: req.user.role });
  const po = invoice.purchase_order;
  const items = po.quotation.items
    .map((i) => `<tr><td>${i.rfq_item.product_name}</td><td>${i.quantity}</td><td>₹${i.unit_price}</td><td>₹${i.subtotal}</td></tr>`)
    .join('');

  const cgst = (invoice.tax_amount / 2).toFixed(2);
  const buffer = await generatePDF('invoice.html', {
    invoiceNumber: invoice.invoice_number,
    invoiceDate: new Date(invoice.created_at).toLocaleDateString('en-IN'),
    dueDate: 'N/A',
    vendorName: po.vendor.name,
    vendorEmail: po.vendor.contact_email,
    vendorGST: po.vendor.gst_number || 'N/A',
    itemsRows: items,
    subtotal: invoice.subtotal.toFixed(2),
    cgst,
    sgst: cgst,
    total: invoice.total.toFixed(2),
  });

  await sendEmail({
    to: po.vendor.contact_email,
    subject: `Invoice ${invoice.invoice_number} from VendorBridge`,
    templateName: 'email-approval-notification.html',
    data: { invoiceNumber: invoice.invoice_number },
    attachments: [{ filename: `${invoice.invoice_number}.pdf`, content: buffer }],
  });

  await service.markInvoiceSent(req.params.id);
  sendSuccess(res, null, 'Invoice emailed successfully');
});

export const updateStatus = asyncHandler(async (req, res) => {
  const data = await service.updateInvoiceStatus(req.params.id, req.body.status);
  sendSuccess(res, data, 'Status updated');
});
