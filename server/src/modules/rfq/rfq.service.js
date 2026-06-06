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

// Helper function to transform RFQ data for consistent frontend usage
function transformRFQ(rfq) {
  if (!rfq) return null;
  
  return {
    ...rfq,
    rfq_items: rfq.items || [],  // Map 'items' to 'rfq_items' for frontend
    created_by: rfq.creator,      // Also include creator as created_by object
  };
}

export async function listRFQs(user, { status, page = 1, limit = 20 }) {
  // For vendor users, get their vendor ID first
  let vendorId = null;
  if (user.role === 'VENDOR') {
    const vendor = await db.vendor.findUnique({
      where: { user_id: user.id },
      select: { id: true }
    });
    vendorId = vendor?.id;
  }

  const where = {
    ...(status && { status }),
    ...(vendorId && {
      rfq_vendors: { some: { vendor_id: vendorId } },
    }),
  };
  
  const skip = (page - 1) * limit;
  const [rfqs, total] = await Promise.all([
    db.rfq.findMany({ 
      where, 
      skip, 
      take: parseInt(limit), 
      orderBy: { created_at: 'desc' }, 
      include: { 
        _count: { 
          select: { 
            quotations: true, 
            items: true, 
            rfq_vendors: true 
          } 
        }, 
        items: true, 
        rfq_vendors: { 
          include: { 
            vendor: { 
              select: { id: true, name: true } 
            } 
          } 
        },
        creator: { select: { id: true, name: true, email: true } }
      } 
    }),
    db.rfq.count({ where }),
  ]);
  
  // Transform RFQs to include rfq_items field and fix _count
  const transformedRfqs = rfqs.map(rfq => ({
    ...rfq,
    rfq_items: rfq.items || [],
    created_by: rfq.creator,
    _count: {
      quotations: rfq._count.quotations || 0,
      rfq_items: rfq._count.items || 0,
      rfq_vendors: rfq._count.rfq_vendors || 0,
    }
  }));
  
  return { rfqs: transformedRfqs, total, page: parseInt(page), pages: Math.ceil(total / limit) };
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

  return transformRFQ(rfq);
}

export async function getRFQ(id, user) {
  const rfq = await db.rfq.findUnique({ 
    where: { id }, 
    include: { 
      ...rfqInclude, 
      quotations: { 
        include: { 
          vendor: { select: { id: true, name: true } }, 
          items: true 
        } 
      } 
    } 
  });
  
  if (!rfq) throw new AppError('RFQ not found', 404, 'NOT_FOUND');

  // For vendor users, check if they are invited
  if (user.role === 'VENDOR') {
    // Get vendor associated with this user
    const vendor = await db.vendor.findUnique({
      where: { user_id: user.id },
      select: { id: true }
    });
    
    if (!vendor) {
      throw new AppError('Vendor profile not found', 404, 'NOT_FOUND');
    }
    
    // Check if vendor is invited to this RFQ
    const invited = rfq.rfq_vendors.some((rv) => rv.vendor_id === vendor.id);
    
    if (!invited) {
      throw new AppError('Access denied - You are not invited to this RFQ', 403, 'FORBIDDEN');
    }
  }
  
  return transformRFQ(rfq);
}

export async function updateRFQ(id, data, userId) {
  const rfq = await db.rfq.findUnique({ where: { id } });
  if (!rfq) throw new AppError('RFQ not found', 404, 'NOT_FOUND');
  if (rfq.status !== 'OPEN') throw new AppError('Cannot update a closed or cancelled RFQ', 400, 'BAD_REQUEST');
  if (rfq.created_by !== userId) throw new AppError('Forbidden', 403, 'FORBIDDEN');

  const { vendorIds, items, ...rest } = data;
  const updatedRfq = await db.rfq.update({ 
    where: { id }, 
    data: { 
      ...rest, 
      ...(rest.deadline && { deadline: new Date(rest.deadline) }) 
    }, 
    include: rfqInclude 
  });
  
  return transformRFQ(updatedRfq);
}

export async function closeRFQ(id, userId) {
  const rfq = await db.rfq.findUnique({ where: { id } });
  if (!rfq) throw new AppError('RFQ not found', 404, 'NOT_FOUND');
  if (rfq.status !== 'OPEN') throw new AppError('RFQ is already closed or cancelled', 400, 'BAD_REQUEST');
  return db.rfq.update({ where: { id }, data: { status: 'CLOSED' } });
}
