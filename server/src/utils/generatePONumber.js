import prisma from '../config/db.js';

export const generatePONumber = async () => {
  const year = new Date().getFullYear();
  const last = await prisma.purchaseOrder.findFirst({
    where: { poNumber: { startsWith: `PO-${year}-` } },
    orderBy: { poNumber: 'desc' },
  });
  const seq = last ? parseInt(last.poNumber.split('-')[2]) + 1 : 1;
  return `PO-${year}-${String(seq).padStart(4, '0')}`;
};
