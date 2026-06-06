import db from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';
import { calculateTax } from '../../utils/calculateTax.js';
import { generatePONumber } from '../../utils/generatePONumber.js';
import { getIO } from '../../config/socket.js';

const quotationIncludes = {
  quotation: {
    include: {
      vendor: true,
      rfq: true,
      items: { include: { rfq_item: true } },
    },
  },
  approver: { select: { id: true, name: true } },
};

export const listPending = async () => {
  return db.approval.findMany({
    where: { status: 'PENDING' },
    include: quotationIncludes,
    orderBy: { created_at: 'asc' },
  });
};

export const getApprovalById = async (id) => {
  const approval = await db.approval.findUnique({ where: { id }, include: quotationIncludes });
  if (!approval) throw new AppError('Approval not found', 404, 'NOT_FOUND');
  return approval;
};

export const approveQuotation = async (id, { remarks, actedById }) => {
  const approval = await db.approval.findUnique({
    where: { id },
    include: { quotation: { include: { items: true, vendor: true } } },
  });

  if (!approval) throw new AppError('Approval not found', 404, 'NOT_FOUND');
  if (approval.status !== 'PENDING') throw new AppError('Approval already actioned', 400, 'ALREADY_ACTIONED');

  const subtotal = approval.quotation.items.reduce((sum, i) => sum + i.subtotal, 0);
  const { tax_amount, total, tax_rate } = calculateTax(subtotal);
  const po_number = await generatePONumber();

  const [updatedApproval, , po] = await db.$transaction([
    db.approval.update({
      where: { id },
      data: { status: 'APPROVED', remarks, approver_id: actedById, acted_at: new Date() },
    }),
    db.quotation.update({
      where: { id: approval.quotation_id },
      data: { status: 'SELECTED' },
    }),
    db.purchaseOrder.create({
      data: {
        po_number,
        quotation_id: approval.quotation_id,
        vendor_id: approval.quotation.vendor_id,
        total_amount: total,
        tax_amount,
        tax_rate,
      },
    }),
  ]);

  try {
    getIO().to(`user:${approval.quotation.vendor.user_id}`).emit('approval:approved', { po_number });
  } catch (_) {}

  return { approval: updatedApproval, po };
};

export const rejectQuotation = async (id, { remarks, actedById }) => {
  const approval = await db.approval.findUnique({
    where: { id },
    include: { quotation: { include: { vendor: true } } },
  });

  if (!approval) throw new AppError('Approval not found', 404, 'NOT_FOUND');
  if (approval.status !== 'PENDING') throw new AppError('Approval already actioned', 400, 'ALREADY_ACTIONED');

  const [updatedApproval] = await db.$transaction([
    db.approval.update({
      where: { id },
      data: { status: 'REJECTED', remarks, approver_id: actedById, acted_at: new Date() },
    }),
    db.quotation.update({
      where: { id: approval.quotation_id },
      data: { status: 'REJECTED' },
    }),
  ]);

  try {
    getIO().to(`user:${approval.quotation.vendor.user_id}`).emit('approval:rejected', { id });
  } catch (_) {}

  return updatedApproval;
};
