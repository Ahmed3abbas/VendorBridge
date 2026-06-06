import db from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';
import { sendEmail } from '../../utils/sendEmail.js';

const rfqInclude = {
  creator: { select: { id: true, name: true, email: true } },
  items: true,
  rfq_vendors: { include: { vendor: { select: { id: true, name: true, contact_email: true } } } },
  attachments: true,
  _count: { select: { quotations: true } },
};

export async function listRFQs(user, { status, page = 1, limit = 20 }) {
  const where = {
    ...(status && { status }),
    ...(user.role === 'VENDOR' && {
      rfq_vendors: { some: { vendor: { user_id: user.id } } },
    }),
  };
  const skip = (page - 1) * limit;
  const [rfqs, total] = await Promise.all([
    db.rfq.findMany({ where, skip, take: parseInt(limit), orderBy: { created_at: 'desc' }, include: { _count: { select: { quotations: true } }, items: true } }),
    db.rfq.count({ where }),
  ]);
  return { rfqs, total, page: parseInt(page), pages: Math.ceil(total / limit) };
}

export async function createRFQ({ title, description, deadline, items, vendorIds }, userId) {
  const rfq = await db.rfq.create({
    data: {
      title, description, deadline: new Date(deadline), created_by: userId,
      items: { create: items },
      rfq_vendors: { create: vendorIds.map((vendor_id) => ({ vendor_id })) },
    },
    include: rfqInclude,
  });

  // Email invited vendors
  const vendors = rfq.rfq_vendors.map((rv) => rv.vendor);
  await Promise.allSettled(
    vendors.map((v) =>
      sendEmail({
        to: v.contact_email,
        subject: `RFQ Invitation: ${rfq.title}`,
        templateName: 'email-rfq-invite.html',
        data: { vendor_name: v.name, rfq_title: rfq.title, deadline: new Date(rfq.deadline).toLocaleDateString() },
      })
    )
  );

  return rfq;
}

export async function getRFQ(id, user) {
  const rfq = await db.rfq.findUnique({ where: { id }, include: { ...rfqInclude, quotations: { include: { vendor: { select: { id: true, name: true } }, items: true } } } });
  if (!rfq) throw new AppError('RFQ not found', 404, 'NOT_FOUND');

  if (user.role === 'VENDOR') {
    const invited = rfq.rfq_vendors.some((rv) => rv.vendor.user_id === user.id);
    if (!invited) throw new AppError('Access denied', 403, 'FORBIDDEN');
  }
  return rfq;
}

export async function updateRFQ(id, data, userId) {
  const rfq = await db.rfq.findUnique({ where: { id } });
  if (!rfq) throw new AppError('RFQ not found', 404, 'NOT_FOUND');
  if (rfq.status !== 'OPEN') throw new AppError('Cannot update a closed or cancelled RFQ', 400, 'BAD_REQUEST');
  if (rfq.created_by !== userId) throw new AppError('Forbidden', 403, 'FORBIDDEN');

  const { vendorIds, items, ...rest } = data;
  return db.rfq.update({ where: { id }, data: { ...rest, ...(new Date(rest.deadline) && { deadline: new Date(rest.deadline) }) }, include: rfqInclude });
}

export async function closeRFQ(id, userId) {
  const rfq = await db.rfq.findUnique({ where: { id } });
  if (!rfq) throw new AppError('RFQ not found', 404, 'NOT_FOUND');
  if (rfq.status !== 'OPEN') throw new AppError('RFQ is already closed or cancelled', 400, 'BAD_REQUEST');
  return db.rfq.update({ where: { id }, data: { status: 'CLOSED' } });
}
