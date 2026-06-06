import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDashboardStats } from '../hooks/useReports';
import { useRFQs } from '../hooks/useRFQ';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import { formatCurrency, formatCurrencyCompact } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { CardSkeleton, TableSkeleton } from '../components/LoadingSkeleton';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import useAuthStore from '../store/authStore';
import { Card } from '../components/ui/Card';
import { Table, Thead, Th, Tbody, Tr, Td } from '../components/ui/Table';
import Button from '../components/ui/Button';

const METRIC_CONFIGS = [
  { key: 'pendingApprovals', label: 'Pending Approvals', icon: 'fact_check', color: 'text-accent-amber', bg: 'bg-[#F59E0B15]', link: '/approvals' },
  { key: 'activeRFQs',       label: 'Active RFQs',       icon: 'request_quote', color: 'text-secondary-container', bg: 'bg-[#0566d915]', link: '/rfq' },
  { key: 'monthlyPOs',       label: "This Month's POs",  icon: 'shopping_cart', color: 'text-primary-container', bg: 'bg-[#22C55E15]', link: '/purchase-orders' },
  { key: 'totalInvoiced',    label: 'Total Invoiced',    icon: 'receipt',       color: 'text-[#A78BFA]', bg: 'bg-[#A78BFA15]', link: '/invoices', currency: true },
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: rfqData, isLoading: rfqLoading } = useRFQs({ limit: 5 });
  const { data: poData, isLoading: poLoading } = usePurchaseOrders({ limit: 5 });

  const recentRFQs = rfqData?.data ?? [];
  // Dashboard endpoint returns recentPOs directly; fallback to PO list
  const recentPOs = stats?.recentPOs ?? poData?.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg text-text-primary">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-body-md text-text-secondary mt-1">Here's what's happening today</p>
        </div>
        <div className="flex gap-2">
          {['ADMIN', 'PROCUREMENT_OFFICER'].includes(user?.role) && (
            <Button icon="add" onClick={() => navigate('/rfq/new')}>New RFQ</Button>
          )}
          {['ADMIN', 'MANAGER'].includes(user?.role) && (
            <Button variant="outline" icon="fact_check" onClick={() => navigate('/approvals')}>
              Review Approvals
            </Button>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : METRIC_CONFIGS.map((m) => (
              <Link key={m.key} to={m.link}>
                <Card className="hover:bg-surface-hover transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-label-caps text-text-secondary uppercase mb-2">{m.label}</p>
                      <p className="text-headline-lg text-text-primary font-bold">
                        {m.currency
                          ? formatCurrencyCompact(stats?.[m.key] ?? 0)
                          : (stats?.[m.key] ?? 0)}
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded flex items-center justify-center ${m.bg}`}>
                      <span className={`material-symbols-outlined text-[22px] ${m.color}`}>{m.icon}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent RFQs */}
        <Card className="p-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
            <h2 className="text-headline-sm text-text-primary">Recent RFQs</h2>
            <Link to="/rfq" className="text-body-sm text-secondary-container hover:underline">View all</Link>
          </div>
          {rfqLoading ? (
            <div className="p-4"><TableSkeleton rows={4} cols={3} /></div>
          ) : recentRFQs.length === 0 ? (
            <EmptyState icon="request_quote" title="No RFQs yet" />
          ) : (
            <Table>
              <Thead>
                <Th>Title</Th><Th>Status</Th><Th>Deadline</Th><Th>Quotes</Th>
              </Thead>
              <Tbody>
                {recentRFQs.map((rfq) => (
                  <Tr key={rfq.id} onClick={() => navigate(`/rfq/${rfq.id}`)}>
                    <Td className="font-semibold">{rfq.title}</Td>
                    <Td><StatusBadge status={rfq.status} /></Td>
                    <Td className="text-text-secondary">{formatDate(rfq.deadline)}</Td>
                    <Td className="font-mono-data">{rfq._count?.quotations ?? 0}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Card>

        {/* Recent POs */}
        <Card className="p-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
            <h2 className="text-headline-sm text-text-primary">Recent Purchase Orders</h2>
            <Link to="/purchase-orders" className="text-body-sm text-secondary-container hover:underline">View all</Link>
          </div>
          {poLoading ? (
            <div className="p-4"><TableSkeleton rows={4} cols={3} /></div>
          ) : recentPOs.length === 0 ? (
            <EmptyState icon="shopping_cart" title="No purchase orders yet" />
          ) : (
            <Table>
              <Thead>
                <Th>PO Number</Th><Th>Vendor</Th><Th>Total</Th><Th>Status</Th>
              </Thead>
              <Tbody>
                {recentPOs.map((po) => (
                  <Tr key={po.id} onClick={() => navigate('/purchase-orders')}>
                    <Td className="font-mono-data text-secondary-container">{po.po_number}</Td>
                    <Td className="font-semibold">{po.vendor?.name}</Td>
                    <Td className="font-mono-data">{formatCurrency(po.total_amount)}</Td>
                    <Td><StatusBadge status={po.status} /></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}
