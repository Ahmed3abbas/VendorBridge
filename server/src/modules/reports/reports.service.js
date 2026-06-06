import prisma from '../../config/db.js';

export const getDashboard = async ({ userId, role }) => {
  const isVendor = role === 'VENDOR';
  const isOfficer = role === 'PROCUREMENT_OFFICER';

  const vendorId = isVendor
    ? (await prisma.user.findUnique({ where: { id: userId }, select: { vendorId: true } }))?.vendorId
    : null;

  const [pendingApprovals, activeRFQs, recentPOs, recentInvoices] = await Promise.all([
    isVendor
      ? 0
      : prisma.approval.count({ where: { status: 'PENDING' } }),

    prisma.rFQ.count({
      where: {
        status: 'OPEN',
        ...(isOfficer ? { createdById: userId } : {}),
        ...(isVendor ? { rfqVendors: { some: { vendorId } } } : {}),
      },
    }),

    prisma.purchaseOrder.findMany({
      where: vendorId ? { vendorId } : {},
      include: { vendor: { select: { name: true } } },
      orderBy: { issuedAt: 'desc' },
      take: 5,
    }),

    prisma.invoice.findMany({
      where: vendorId ? { vendorId } : {},
      include: { vendor: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
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

  const pos = await prisma.purchaseOrder.findMany({
    where: { issuedAt: { gte: twelveMonthsAgo } },
    select: { issuedAt: true, total: true },
  });

  const monthly = {};
  pos.forEach(({ issuedAt, total }) => {
    const key = `${issuedAt.getFullYear()}-${String(issuedAt.getMonth() + 1).padStart(2, '0')}`;
    monthly[key] = (monthly[key] || 0) + total;
  });

  return Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month, total: Math.round(total * 100) / 100 }));
};

export const getVendorPerformance = async () => {
  const vendors = await prisma.vendor.findMany({
    where: { status: 'ACTIVE' },
    include: {
      purchaseOrders: { select: { total: true, status: true, issuedAt: true } },
      quotations: { select: { status: true } },
    },
  });

  return vendors.map((v) => {
    const totalPOs = v.purchaseOrders.length;
    const totalSpend = v.purchaseOrders.reduce((s, p) => s + p.total, 0);
    const wonQuotes = v.quotations.filter((q) => q.status === 'SELECTED').length;
    const totalQuotes = v.quotations.length;
    const completedPOs = v.purchaseOrders.filter((p) => p.status === 'COMPLETED').length;

    return {
      vendorId: v.id,
      vendorName: v.name,
      totalPOs,
      totalSpend: Math.round(totalSpend * 100) / 100,
      winRate: totalQuotes ? Math.round((wonQuotes / totalQuotes) * 100) : 0,
      onTimeRate: totalPOs ? Math.round((completedPOs / totalPOs) * 100) : 0,
    };
  });
};
