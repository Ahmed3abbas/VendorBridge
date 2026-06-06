import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { generatePDF } from '../../utils/generatePDF.js';
import { sendEmail } from '../../utils/sendEmail.js';
import * as service from './invoices.service.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const INVOICE_TEMPLATE = join(__dirname, '../../templates/invoice.html');

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
  const data = await service.getInvoiceById(req.params.id);
  sendSuccess(res, data);
});

export const downloadPDF = asyncHandler(async (req, res) => {
  const invoice = await service.getInvoiceById(req.params.id);
  const items = invoice.po.quotation.items
    .map((i) => `<tr><td>${i.rfqItem.description}</td><td>${i.quantity}</td><td>₹${i.unitPrice}</td><td>₹${i.subtotal}</td></tr>`)
    .join('');

  const cgst = (invoice.taxAmount / 2).toFixed(2);
  const buffer = await generatePDF(INVOICE_TEMPLATE, {
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: new Date(invoice.createdAt).toLocaleDateString('en-IN'),
    dueDate: invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-IN') : 'N/A',
    vendorName: invoice.vendor.name,
    vendorEmail: invoice.vendor.email,
    vendorGST: invoice.vendor.gstNumber || 'N/A',
    itemsRows: items,
    subtotal: invoice.subtotal.toFixed(2),
    cgst,
    sgst: cgst,
    total: invoice.total.toFixed(2),
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${invoice.invoiceNumber}.pdf"`);
  res.send(buffer);
});

export const sendInvoiceEmail = asyncHandler(async (req, res) => {
  const invoice = await service.getInvoiceById(req.params.id);
  const items = invoice.po.quotation.items
    .map((i) => `<tr><td>${i.rfqItem.description}</td><td>${i.quantity}</td><td>₹${i.unitPrice}</td><td>₹${i.subtotal}</td></tr>`)
    .join('');

  const cgst = (invoice.taxAmount / 2).toFixed(2);
  const buffer = await generatePDF(INVOICE_TEMPLATE, {
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: new Date(invoice.createdAt).toLocaleDateString('en-IN'),
    dueDate: invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-IN') : 'N/A',
    vendorName: invoice.vendor.name,
    vendorEmail: invoice.vendor.email,
    vendorGST: invoice.vendor.gstNumber || 'N/A',
    itemsRows: items,
    subtotal: invoice.subtotal.toFixed(2),
    cgst,
    sgst: cgst,
    total: invoice.total.toFixed(2),
  });

  const emailHtml = await readFile(join(__dirname, '../../templates/email-approval-notification.html'), 'utf-8');

  await sendEmail({
    to: invoice.vendor.email,
    subject: `Invoice ${invoice.invoiceNumber} from VendorBridge`,
    html: emailHtml.replaceAll('{{invoiceNumber}}', invoice.invoiceNumber),
    attachments: [{ filename: `${invoice.invoiceNumber}.pdf`, content: buffer }],
  });

  await service.markInvoiceSent(req.params.id);
  sendSuccess(res, null, 'Invoice emailed successfully');
});

export const updateStatus = asyncHandler(async (req, res) => {
  const data = await service.updateInvoiceStatus(req.params.id, req.body.status);
  sendSuccess(res, data, 'Status updated');
});
