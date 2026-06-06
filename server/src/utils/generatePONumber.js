import db from '../config/db.js';

export async function generatePONumber() {
  const year = new Date().getFullYear();
  const prefix = `PO-${year}-`;
  const last = await db.purchaseOrder.findFirst({
    where: { po_number: { startsWith: prefix } },
    orderBy: { po_number: 'desc' },
  });
  const seq = last ? parseInt(last.po_number.split('-')[2]) + 1 : 1;
  return `${prefix}${String(seq).padStart(4, '0')}`;
}
