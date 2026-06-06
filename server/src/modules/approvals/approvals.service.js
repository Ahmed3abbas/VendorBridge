import prisma from '../../config/db.js';
import AppError from '../../utils/AppError.js';
import { calculateTax } from '../../utils/calculateTax.js';
import { generatePONumber } from '../../utils/generatePONumber.js';
import { getIO } from '../../config/socket.js';

const quotationWithContext = {
  quotation: {
    include: {
      vendor: true,
      rfq: true,
      items: { include: { rfqItem: true } },
    },
  },
  actedBy: { select: { id: true, name: true } },
};

export const listPending = async () => {
  return prisma.approval.findMany({
    where: { status: 'PENDING' },
    include: quotationWithContext,
    orderBy: { createdAt: 'asc' },
  });
};

export const getApprovalById = async (id) => {
  const approval = await prisma.approval.findUnique({
    where: { id },
    include: quotationWithContext,
  });
  if (!approval) throw new AppError('Approval not found', 404, 'NOT_FOUND');
  return approval;
};

export const approveQuotation = async (id, { remarks, actedById }) => {
  const approval = await prisma.approval.findUnique({
    where: { id },
    include: { quotation: { include: { items: true, vendor: true } } },
  });

  if (!approval) throw new AppError('Approval not found', 404, 'NOT_FOUND');
  if (approval.status !== 'PENDING') throw new AppError('Approval already actioned', 400, 'ALREADY_ACTIONED');

  const subtotal = approval.quotation.items.reduce((sum, i) => sum + i.subtotal, 0);
  const { taxAmount, total, taxRate } = calculateTax(subtotal);
  const poNumber = await generatePONumber();

  const [updatedApproval, po] = await prisma.$transaction([
    prisma.approval.update({
      where: { id },
      data: { status: 'APPROVED', remarks, actedById, actedAt: new Date() },
    }),
    prisma.quotation.update({
      where: { id: approval.quotationId },
      data: { status: 'SELECTED' },
    }),
    prisma.purchaseOrder.create({
      data: {
        poNumber,
        quotationId: approval.quotationId,
        vendorId: approval.quotation.vendorId,
        subtotal,
        taxRate,
        taxAmount,
        total,
      },
    }),
  ]);

  try {
    getIO().to(`vendor:${approval.quotation.vendorId}`).emit('approval:approved', { poNumber });
  } catch (_) {}

  return { approval: updatedApproval, po };
};

export const rejectQuotation = async (id, { remarks, actedById }) => {
  const approval = await prisma.approval.findUnique({
    where: { id },
    include: { quotation: { include: { rfq: true } } },
  });

  if (!approval) throw new AppError('Approval not found', 404, 'NOT_FOUND');
  if (approval.status !== 'PENDING') throw new AppError('Approval already actioned', 400, 'ALREADY_ACTIONED');

  const [updatedApproval] = await prisma.$transaction([
    prisma.approval.update({
      where: { id },
      data: { status: 'REJECTED', remarks, actedById, actedAt: new Date() },
    }),
    prisma.quotation.update({
      where: { id: approval.quotationId },
      data: { status: 'REJECTED' },
    }),
  ]);

  try {
    getIO().to(`vendor:${approval.quotation.vendorId}`).emit('approval:rejected', { id });
  } catch (_) {}

  return updatedApproval;
};
