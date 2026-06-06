import db from '../config/db.js';

export async function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;
  const last = await db.invoice.findFirst({
    where: { invoice_number: { startsWith: prefix } },
    orderBy: { invoice_number: 'desc' },
  });
  const seq = last ? parseInt(last.invoice_number.split('-')[2]) + 1 : 1;
  return `${prefix}${String(seq).padStart(4, '0')}`;
}
