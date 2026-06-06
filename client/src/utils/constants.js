export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  OFFICER: 'PROCUREMENT_OFFICER',
  VENDOR: 'VENDOR',
};

export const VENDOR_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLACKLISTED: 'BLACKLISTED',
};

export const RFQ_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  CANCELLED: 'CANCELLED',
};

export const QUOTATION_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  SELECTED: 'SELECTED',
  REJECTED: 'REJECTED',
};

export const APPROVAL_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const PO_STATUS = {
  ISSUED: 'ISSUED',
  ACKNOWLEDGED: 'ACKNOWLEDGED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const INVOICE_STATUS = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
};

// Badge color classes — matches Deep Industry design tokens
export const STATUS_COLORS = {
  // Vendor
  ACTIVE: 'bg-[#22C55E20] text-[#22C55E]',
  INACTIVE: 'bg-[#9CA3AF20] text-[#9CA3AF]',
  BLACKLISTED: 'bg-[#EF444420] text-[#EF4444]',
  // RFQ
  OPEN: 'bg-[#0566d920] text-[#0566d9]',
  CLOSED: 'bg-[#9CA3AF20] text-[#9CA3AF]',
  CANCELLED: 'bg-[#EF444420] text-[#EF4444]',
  // Quotation
  DRAFT: 'bg-[#F59E0B20] text-[#F59E0B]',
  SUBMITTED: 'bg-[#0566d920] text-[#0566d9]',
  SELECTED: 'bg-[#22C55E20] text-[#22C55E]',
  REJECTED: 'bg-[#EF444420] text-[#EF4444]',
  // Approval
  PENDING: 'bg-[#F59E0B20] text-[#F59E0B]',
  APPROVED: 'bg-[#22C55E20] text-[#22C55E]',
  // PO
  ISSUED: 'bg-[#0566d920] text-[#0566d9]',
  ACKNOWLEDGED: 'bg-[#F59E0B20] text-[#F59E0B]',
  COMPLETED: 'bg-[#22C55E20] text-[#22C55E]',
  // Invoice
  SENT: 'bg-[#0566d920] text-[#0566d9]',
  PAID: 'bg-[#22C55E20] text-[#22C55E]',
  OVERDUE: 'bg-[#EF444420] text-[#EF4444]',
};

// Role-based navigation — matches design reference sidebar
export const NAV_ITEMS = [
  { label: 'Dashboard',       path: '/dashboard',       icon: 'dashboard',       roles: ['ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER', 'VENDOR'] },
  { label: 'Vendors',         path: '/vendors',         icon: 'storefront',      roles: ['ADMIN', 'PROCUREMENT_OFFICER'] },
  { label: 'RFQs',            path: '/rfq',             icon: 'request_quote',   roles: ['ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER', 'VENDOR'] },
  { label: 'Quotations',      path: '/rfq',             icon: 'description',     roles: ['VENDOR'] },
  { label: 'Approvals',       path: '/approvals',       icon: 'fact_check',      roles: ['ADMIN', 'MANAGER'] },
  { label: 'Purchase Orders', path: '/purchase-orders', icon: 'shopping_cart',   roles: ['ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER', 'VENDOR'] },
  { label: 'Invoices',        path: '/invoices',        icon: 'receipt',         roles: ['ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER', 'VENDOR'] },
  { label: 'Reports',         path: '/reports',         icon: 'analytics',       roles: ['ADMIN', 'MANAGER'] },
  { label: 'Activity',        path: '/activity-log',    icon: 'history',         roles: ['ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER'] },
];

export const VENDOR_CATEGORIES = [
  'Hardware',
  'Software & IT',
  'Logistics',
  'Raw Materials',
  'Office Supplies',
  'Manufacturing',
  'Consulting',
  'Construction',
  'Food & Beverages',
  'Healthcare',
  'Other',
];
