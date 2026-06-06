import db from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';

const poIncludes = {
  vendor: true,
  quotation: {
    include: {
      rfq: true,
      items: { include: { rfq_item: true } },
    },
  },
};

export const listPOs = async ({ status, page = 1, limit = 20, userId, role }) => {
  const where = {};
  if (status) where.status = status;
  if (role === 'VENDOR') {
    const user = await db.user.findUnique({ where: { id: userId }, include: { vendor: { select: { id: true } } } });
    if (user?.vendor?.id) where.vendor_id = user.vendor.id;
  }

  const [data, total] = await Promise.all([
    db.purchaseOrder.findMany({
      where,
      include: poIncludes,
      orderBy: { issued_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.purchaseOrder.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getPOById = async (id) => {
  const po = await db.purchaseOrder.findUnique({ where: { id }, include: poIncludes });
  if (!po) throw new AppError('Purchase order not found', 404, 'NOT_FOUND');
  return po;
};

export const updatePOStatus = async (id, status) => {
  const po = await db.purchaseOrder.findUnique({ where: { id } });
  if (!po) throw new AppError('Purchase order not found', 404, 'NOT_FOUND');
  return db.purchaseOrder.update({ where: { id }, data: { status } });
};
