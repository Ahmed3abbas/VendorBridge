import db from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';

export async function listVendors({ search, category, status, page = 1, limit = 20 }) {
  const where = {
    ...(search && { OR: [{ name: { contains: search, mode: 'insensitive' } }, { gst_number: { contains: search } }] }),
    ...(category && { category }),
    ...(status && { status }),
  };
  const skip = (page - 1) * limit;
  const [vendors, total] = await Promise.all([
    db.vendor.findMany({ where, skip, take: parseInt(limit), orderBy: { name: 'asc' } }),
    db.vendor.count({ where }),
  ]);
  return { vendors, total, page: parseInt(page), pages: Math.ceil(total / limit) };
}

export async function createVendor(data) {
  const exists = await db.vendor.findUnique({ where: { gst_number: data.gst_number } });
  if (exists) throw new AppError('GST number already registered', 409, 'CONFLICT');
  return db.vendor.create({ data });
}

export async function getVendor(id) {
  const vendor = await db.vendor.findUnique({
    where: { id },
    include: {
      rfq_vendors: { include: { rfq: { select: { id: true, title: true, status: true, deadline: true } } } },
      purchase_orders: { select: { id: true, po_number: true, status: true, total_amount: true, issued_at: true } },
    },
  });
  if (!vendor) throw new AppError('Vendor not found', 404, 'NOT_FOUND');
  return vendor;
}

export async function updateVendor(id, data) {
  await getVendor(id);
  return db.vendor.update({ where: { id }, data });
}

export async function getVendorPerformance(id) {
  await getVendor(id);
  const [pos, quotations] = await Promise.all([
    db.purchaseOrder.findMany({ where: { vendor_id: id }, select: { total_amount: true, status: true } }),
    db.quotation.findMany({ where: { vendor_id: id }, select: { status: true } }),
  ]);

  const totalSpend = pos.reduce((s, p) => s + p.total_amount, 0);
  const totalQuotes = quotations.length;
  const wins = quotations.filter((q) => q.status === 'SELECTED').length;

  return {
    total_pos: pos.length,
    total_spend: totalSpend,
    win_rate: totalQuotes ? Math.round((wins / totalQuotes) * 100) : 0,
    total_quotations: totalQuotes,
  };
}
