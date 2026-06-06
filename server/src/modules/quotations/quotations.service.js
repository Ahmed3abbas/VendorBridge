import db from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';
import { emitToUser } from '../../config/socket.js';

export async function submitQuotation(rfqId, { items, delivery_date, notes, total_amount }, userId) {
  const rfq = await db.rfq.findUnique({ where: { id: rfqId }, include: { rfq_vendors: { include: { vendor: true } } } });
  if (!rfq) throw new AppError('RFQ not found', 404, 'NOT_FOUND');
  if (rfq.status !== 'OPEN') throw new AppError('RFQ is not open', 400, 'BAD_REQUEST');
  if (new Date() > rfq.deadline) throw new AppError('RFQ deadline has passed', 400, 'BAD_REQUEST');

  const vendor = await db.vendor.findFirst({ where: { user_id: userId } });
  if (!vendor) throw new AppError('Vendor profile not found', 404, 'NOT_FOUND');

  const invited = rfq.rfq_vendors.some((rv) => rv.vendor_id === vendor.id);
  if (!invited) throw new AppError('You were not invited to this RFQ', 403, 'FORBIDDEN');

  const existing = await db.quotation.findUnique({ where: { rfq_id_vendor_id: { rfq_id: rfqId, vendor_id: vendor.id } } });
  if (existing && existing.status !== 'DRAFT') throw new AppError('Quotation already submitted', 409, 'CONFLICT');

  const data = {
    rfq_id: rfqId, vendor_id: vendor.id,
    total_amount, delivery_date: new Date(delivery_date), notes, status: 'SUBMITTED',
    items: { create: items },
  };

  if (existing) {
    await db.quotationItem.deleteMany({ where: { quotation_id: existing.id } });
    return db.quotation.update({ where: { id: existing.id }, data: { ...data, items: { create: items } }, include: { items: true, vendor: { select: { id: true, name: true } } } });
  }
  return db.quotation.create({ data, include: { items: true, vendor: { select: { id: true, name: true } } } });
}

export async function getQuotationsForRFQ(rfqId) {
  return db.quotation.findMany({
    where: { rfq_id: rfqId },
    include: { vendor: { select: { id: true, name: true, rating: true } }, items: { include: { rfq_item: true } } },
    orderBy: { total_amount: 'asc' },
  });
}

export async function updateQuotation(id, data, userId) {
  const vendor = await db.vendor.findFirst({ where: { user_id: userId } });
  const q = await db.quotation.findUnique({ where: { id }, include: { rfq: true } });
  if (!q) throw new AppError('Quotation not found', 404, 'NOT_FOUND');
  if (q.vendor_id !== vendor?.id) throw new AppError('Forbidden', 403, 'FORBIDDEN');
  if (q.rfq.status !== 'OPEN') throw new AppError('RFQ is closed', 400, 'BAD_REQUEST');
  if (new Date() > q.rfq.deadline) throw new AppError('Deadline passed', 400, 'BAD_REQUEST');

  return db.quotation.update({ where: { id }, data: { total_amount: data.total_amount, delivery_date: new Date(data.delivery_date), notes: data.notes }, include: { items: true } });
}

export async function selectQuotation(id, officerId) {
  const q = await db.quotation.findUnique({ where: { id }, include: { rfq: true } });
  if (!q) throw new AppError('Quotation not found', 404, 'NOT_FOUND');
  if (q.status !== 'SUBMITTED') throw new AppError('Quotation must be SUBMITTED to select', 400, 'BAD_REQUEST');

  // Find manager to assign as approver
  const manager = await db.user.findFirst({ where: { role: 'MANAGER', is_active: true } });
  if (!manager) throw new AppError('No active manager found for approval', 500, 'INTERNAL_ERROR');

  const [updatedQ, approval] = await db.$transaction([
    db.quotation.update({ where: { id }, data: { status: 'SELECTED' } }),
    db.approval.create({ data: { quotation_id: id, approver_id: manager.id } }),
  ]);

  // Notify manager via socket
  emitToUser(manager.id, 'approval:new', { quotation_id: id, rfq_title: q.rfq.title });

  return { quotation: updatedQ, approval };
}
