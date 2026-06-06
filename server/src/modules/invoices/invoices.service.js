import prisma from '../../config/db.js';
import AppError from '../../utils/AppError.js';
import { calculateTax } from '../../utils/calculateTax.js';
import { generateInvoiceNumber } from '../../utils/generateInvoiceNumber.js';

const invoiceIncludes = {
  vendor: true,
  po: {
    include: {
      quotation: {
        include: {
          rfq: true,
          items: { include: { rfqItem: true } },
        },
      },
    },
  },
};

export const generateInvoice = async ({ poId, taxRate = 18 }) => {
  const po = await prisma.purchaseOrder.findUnique({
    where: { id: poId },
    include: { quotation: { include: { items: true } }, vendor: true },
  });
  if (!po) throw new AppError('Purchase order not found', 404, 'NOT_FOUND');

  const existing = await prisma.invoice.findFirst({ where: { poId } });
  if (existing) throw new AppError('Invoice already exists for this PO', 400, 'DUPLICATE');

  const subtotal = po.quotation.items.reduce((sum, i) => sum + i.subtotal, 0);
  const { taxAmount, total } = calculateTax(subtotal, taxRate);
  const invoiceNumber = await generateInvoiceNumber();

  return prisma.invoice.create({
    data: {
      invoiceNumber,
      poId,
      vendorId: po.vendorId,
      subtotal,
      taxRate,
      taxAmount,
      total,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    include: invoiceIncludes,
  });
};

export const listInvoices = async ({ status, page = 1, limit = 20 }) => {
  const where = status ? { status } : {};
  const [data, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      include: invoiceIncludes,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.invoice.count({ where }),
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getInvoiceById = async (id) => {
  const invoice = await prisma.invoice.findUnique({ where: { id }, include: invoiceIncludes });
  if (!invoice) throw new AppError('Invoice not found', 404, 'NOT_FOUND');
  return invoice;
};

export const updateInvoiceStatus = async (id, status) => {
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) throw new AppError('Invoice not found', 404, 'NOT_FOUND');
  return prisma.invoice.update({ where: { id }, data: { status } });
};

export const markInvoiceSent = async (id) => {
  return prisma.invoice.update({
    where: { id },
    data: { status: 'SENT', sentAt: new Date() },
  });
};
