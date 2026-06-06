import db from '../../config/db.js';

export const getDashboard = async ({ userId, role }) => {
  const isVendor = role === 'VENDOR';
  const isOfficer = role === 'PROCUREMENT_OFFICER';

  const vendorId = isVendor
    ? (await db.user.findUnique({ where: { id: userId }, include: { vendor: { select: { id: true } } } }))?.vendor?.id
    : null;

  const [pendingApprovals, activeRFQs, recentPOs, recentInvoices] = await Promise.all([
    isVendor
      ? 0
      : db.approval.count({ where: { status: 'PENDING' } }),

    db.rfq.count({
      where: {
        status: 'OPEN',
        ...(isOfficer ? { created_by: userId } : {}),
        ...(isVendor ? { rfq_vendors: { some: { vendor_id: vendorId } } } : {}),
      },
    }),

    db.purchaseOrder.findMany({
      where: vendorId ? { vendor_id: vendorId } : {},
      include: { vendor: { select: { name: true } } },
      orderBy: { issued_at: 'desc' },
      take: 5,
    }),

    db.invoice.findMany({
      where: vendorId ? { purchase_order: { vendor_id: vendorId } } : {},
      include: { purchase_order: { include: { vendor: { select: { name: true } } } } },
      orderBy: { created_at: 'desc' },
      take: 5,
    }),
  ]);

  return { pendingApprovals, activeRFQs, recentPOs, recentInvoices };
};

export const getSpendTrend = async () => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const pos = await db.purchaseOrder.findMany({
    where: { issued_at: { gte: twelveMonthsAgo } },
    select: { issued_at: true, total_amount: true },
  });

  const monthly = {};
  pos.forEach(({ issued_at, total_amount }) => {
    const key = `${issued_at.getFullYear()}-${String(issued_at.getMonth() + 1).padStart(2, '0')}`;
    monthly[key] = (monthly[key] || 0) + total_amount;
  });

  return Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month, total: parseFloat(total.toFixed(2)) }));
};

export const getVendorPerformance = async () => {
  const vendors = await db.vendor.findMany({
    where: { status: 'ACTIVE' },
    include: {
      purchase_orders: { select: { total_amount: true, status: true } },
      quotations: { select: { status: true } },
    },
  });

  return vendors.map((v) => {
    const totalPOs = v.purchase_orders.length;
    const totalSpend = v.purchase_orders.reduce((s, p) => s + p.total_amount, 0);
    const wonQuotes = v.quotations.filter((q) => q.status === 'SELECTED').length;
    const totalQuotes = v.quotations.length;
    const completedPOs = v.purchase_orders.filter((p) => p.status === 'COMPLETED').length;

    return {
      vendorId: v.id,
      vendorName: v.name,
      totalPOs,
      totalSpend: parseFloat(totalSpend.toFixed(2)),
      winRate: totalQuotes ? Math.round((wonQuotes / totalQuotes) * 100) : 0,
      onTimeRate: totalPOs ? Math.round((completedPOs / totalPOs) * 100) : 0,
    };
  });
};
