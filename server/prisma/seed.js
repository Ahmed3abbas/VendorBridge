import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Demo@1234', 12);

  // Users
  const [admin, officer, manager, vendor1User, vendor2User] = await Promise.all([
    db.user.upsert({ where: { email: 'admin@demo.com' }, update: {}, create: { email: 'admin@demo.com', password_hash: hash, name: 'Admin User', role: 'ADMIN' } }),
    db.user.upsert({ where: { email: 'officer@demo.com' }, update: {}, create: { email: 'officer@demo.com', password_hash: hash, name: 'Procurement Officer', role: 'PROCUREMENT_OFFICER' } }),
    db.user.upsert({ where: { email: 'manager@demo.com' }, update: {}, create: { email: 'manager@demo.com', password_hash: hash, name: 'Manager User', role: 'MANAGER' } }),
    db.user.upsert({ where: { email: 'vendor1@demo.com' }, update: {}, create: { email: 'vendor1@demo.com', password_hash: hash, name: 'Tech Supplies Ltd', role: 'VENDOR' } }),
    db.user.upsert({ where: { email: 'vendor2@demo.com' }, update: {}, create: { email: 'vendor2@demo.com', password_hash: hash, name: 'Office Pro India', role: 'VENDOR' } }),
  ]);

  // Vendors
  const [vendor1, vendor2] = await Promise.all([
    db.vendor.upsert({
      where: { gst_number: '27AABCT1332L1ZV' },
      update: {},
      create: { name: 'Tech Supplies Ltd', gst_number: '27AABCT1332L1ZV', category: 'IT', contact_email: 'vendor1@demo.com', contact_phone: '9876543210', address: 'Mumbai, Maharashtra', user_id: vendor1User.id },
    }),
    db.vendor.upsert({
      where: { gst_number: '07AAACO0840L1ZM' },
      update: {},
      create: { name: 'Office Pro India', gst_number: '07AAACO0840L1ZM', category: 'Stationery', contact_email: 'vendor2@demo.com', contact_phone: '9123456780', address: 'Delhi, India', user_id: vendor2User.id },
    }),
  ]);

  // RFQ
  const rfq = await db.rfq.create({
    data: {
      title: 'Office Laptops Q3 2024',
      description: 'Procurement of laptops for engineering team',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'OPEN',
      created_by: officer.id,
      items: {
        create: [{ product_name: 'Laptop 14" i7', quantity: 10, unit: 'units', description: 'Min 16GB RAM, 512GB SSD' }],
      },
      rfq_vendors: { create: [{ vendor_id: vendor1.id }, { vendor_id: vendor2.id }] },
    },
    include: { items: true },
  });

  // Quotations
  const [q1, q2] = await Promise.all([
    db.quotation.create({
      data: {
        rfq_id: rfq.id, vendor_id: vendor1.id,
        total_amount: 850000, delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), status: 'SUBMITTED',
        items: { create: [{ rfq_item_id: rfq.items[0].id, unit_price: 85000, quantity: 10, subtotal: 850000 }] },
      },
    }),
    db.quotation.create({
      data: {
        rfq_id: rfq.id, vendor_id: vendor2.id,
        total_amount: 795000, delivery_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), status: 'SELECTED',
        items: { create: [{ rfq_item_id: rfq.items[0].id, unit_price: 79500, quantity: 10, subtotal: 795000 }] },
      },
    }),
  ]);

  // Approval
  const approval = await db.approval.create({
    data: { quotation_id: q2.id, approver_id: manager.id, status: 'APPROVED', remarks: 'Best price, approved.', acted_at: new Date() },
  });

  // PO
  const po = await db.purchaseOrder.create({
    data: {
      po_number: 'PO-2024-0001', quotation_id: q2.id, vendor_id: vendor2.id,
      status: 'ISSUED', total_amount: 938100, tax_amount: 143100, tax_rate: 18, issued_at: new Date(),
    },
  });

  // Invoice
  await db.invoice.create({
    data: {
      invoice_number: 'INV-2024-0001', po_id: po.id,
      subtotal: 795000, tax_rate: 18, tax_amount: 143100, total: 938100, status: 'SENT', sent_at: new Date(),
    },
  });

  console.log('✅ Seed complete — demo data ready');
}

main().catch(console.error).finally(() => db.$disconnect());
