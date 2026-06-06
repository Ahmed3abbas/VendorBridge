import prisma from '../../config/db.js';
import AppError from '../../utils/AppError.js';

const poIncludes = {
  vendor: true,
  quotation: {
    include: {
      rfq: true,
      items: { include: { rfqItem: true } },
    },
  },
};

export const listPOs = async ({ status, page = 1, limit = 20, userId, role }) => {
  const where = {};
  if (status) where.status = status;
  if (role === 'VENDOR') {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { vendorId: true } });
    if (user?.vendorId) where.vendorId = user.vendorId;
  }

  const [data, total] = await Promise.all([
    prisma.purchaseOrder.findMany({
      where,
      include: poIncludes,
      orderBy: { issuedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.purchaseOrder.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getPOById = async (id) => {
  const po = await prisma.purchaseOrder.findUnique({ where: { id }, include: poIncludes });
  if (!po) throw new AppError('Purchase order not found', 404, 'NOT_FOUND');
  return po;
};

export const updatePOStatus = async (id, status) => {
  const po = await prisma.purchaseOrder.findUnique({ where: { id } });
  if (!po) throw new AppError('Purchase order not found', 404, 'NOT_FOUND');
  return prisma.purchaseOrder.update({ where: { id }, data: { status } });
};
