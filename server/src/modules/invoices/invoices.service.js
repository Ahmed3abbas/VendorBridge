import db from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';
import { calculateTax } from '../../utils/calculateTax.js';
import { generateInvoiceNumber } from '../../utils/generateInvoiceNumber.js';

const invoiceIncludes = {
  purchase_order: {
    include: {
      vendor: true,
      quotation: {
        include: {
          rfq: true,
          items: { include: { rfq_item: true } },
        },
      },
    },
  },
};

export const generateInvoice = async ({ poId, taxRate = 18 }) => {
  const po = await db.purchaseOrder.findUnique({
    where: { id: poId },
    include: { quotation: { include: { items: true } }, vendor: true },
  });
  if (!po) throw new AppError('Purchase order not found', 404, 'NOT_FOUND');

  const existing = await db.invoice.findFirst({ where: { po_id: poId } });
  if (existing) throw new AppError('Invoice already exists for this PO', 400, 'DUPLICATE');

  const subtotal = po.quotation.items.reduce((sum, i) => sum + i.subtotal, 0);
  const { tax_amount, total } = calculateTax(subtotal, taxRate);
  const invoice_number = await generateInvoiceNumber();

  return db.invoice.create({
    data: {
      invoice_number,
      po_id: poId,
      subtotal,
      tax_rate: taxRate,
      tax_amount,
      total,
    },
    include: invoiceIncludes,
  });
};

export const listInvoices = async ({ status, page = 1, limit = 20 }) => {
  const where = status ? { status } : {};
  const [data, total] = await Promise.all([
    db.invoice.findMany({
      where,
      include: invoiceIncludes,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.invoice.count({ where }),
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getInvoiceById = async (id, { userId, role } = {}) => {
  const invoice = await db.invoice.findUnique({ where: { id }, include: invoiceIncludes });
  if (!invoice) throw new AppError('Invoice not found', 404, 'NOT_FOUND');

  if (role === 'VENDOR') {
    const user = await db.user.findUnique({ where: { id: userId }, include: { vendor: { select: { id: true } } } });
    if (invoice.purchase_order.vendor_id !== user?.vendor?.id) throw new AppError('Forbidden', 403, 'FORBIDDEN');
  }

  return invoice;
};

export const updateInvoiceStatus = async (id, status) => {
  const invoice = await db.invoice.findUnique({ where: { id } });
  if (!invoice) throw new AppError('Invoice not found', 404, 'NOT_FOUND');
  return db.invoice.update({ where: { id }, data: { status } });
};

export const markInvoiceSent = async (id) => {
  return db.invoice.update({ where: { id }, data: { status: 'SENT', sent_at: new Date() } });
};
