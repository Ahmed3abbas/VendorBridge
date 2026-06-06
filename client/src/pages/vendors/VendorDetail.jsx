import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVendor, useVendorPerformance } from '../../hooks/useVendors';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { CardSkeleton } from '../../components/LoadingSkeleton';
import StatusBadge from '../../components/StatusBadge';
import { Card } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/EmptyState';
import useAuthStore from '../../store/authStore';

const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'rfqs', label: 'RFQs' },
  { value: 'pos', label: 'Purchase Orders' },
  { value: 'performance', label: 'Performance' },
];

export default function VendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tab, setTab] = useState('overview');
  const { data: vendor, isLoading } = useVendor(id);
  const { data: perf } = useVendorPerformance(id);

  if (isLoading) return <div className="grid gap-4"><CardSkeleton /><CardSkeleton /></div>;
  if (!vendor) return <EmptyState icon="storefront" title="Vendor not found" />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" icon="arrow_back" onClick={() => navigate('/vendors')} />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-headline-lg text-text-primary">{vendor.name}</h1>
            <StatusBadge status={vendor.status} />
          </div>
          <p className="text-body-sm text-text-secondary">{vendor.category}</p>
        </div>
        {user?.role === 'ADMIN' && (
          <Button variant="outline" icon="edit" onClick={() => navigate(`/vendors/new?edit=${id}`)}>Edit</Button>
        )}
      </div>

      <Tabs value={tab} onChange={setTab} tabs={TABS} />

      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="text-headline-sm text-text-primary mb-4">Vendor Details</h3>
            <dl className="flex flex-col gap-3">
              {[
                ['GST Number', vendor.gst_number ?? '—'],
                ['Category', vendor.category],
                ['Contact Email', vendor.contact_email],
                ['Phone', vendor.phone ?? '—'],
                ['Address', vendor.address ?? '—'],
                ['Rating', vendor.rating?.toFixed(1) ?? '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-body-sm text-text-secondary">{label}</dt>
                  <dd className="text-body-sm text-text-primary font-semibold text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card>
            <h3 className="text-headline-sm text-text-primary mb-4">Quick Stats</h3>
            <dl className="flex flex-col gap-3">
              {[
                ['Total RFQs', vendor._count?.rfq_vendors ?? 0],
                ['Total POs', vendor._count?.purchase_orders ?? 0],
                ['Total Invoices', vendor._count?.invoices ?? 0],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <dt className="text-body-sm text-text-secondary">{label}</dt>
                  <dd className="text-headline-sm text-text-primary font-bold">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      )}

      {tab === 'rfqs' && (
        <Card className="p-0">
          {!vendor.rfq_vendors?.length ? (
            <EmptyState icon="request_quote" title="No RFQs yet" />
          ) : (
            <Table>
              <Thead><Th>Title</Th><Th>Status</Th><Th>Deadline</Th></Thead>
              <Tbody>
                {vendor.rfq_vendors?.map(rv => (
                  <Tr key={rv.rfq?.id} onClick={() => navigate(`/rfq/${rv.rfq?.id}`)}>
                    <Td className="font-semibold">{rv.rfq?.title}</Td>
                    <Td><StatusBadge status={rv.rfq?.status} /></Td>
                    <Td className="text-text-secondary">{formatDate(rv.rfq?.deadline)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Card>
      )}

      {tab === 'pos' && (
        <Card className="p-0">
          {!vendor.purchase_orders?.length ? (
            <EmptyState icon="shopping_cart" title="No purchase orders yet" />
          ) : (
            <Table>
              <Thead><Th>PO Number</Th><Th>Total</Th><Th>Status</Th><Th>Date</Th></Thead>
              <Tbody>
                {vendor.purchase_orders?.map(po => (
                  <Tr key={po.id}>
                    <Td className="font-mono-data text-secondary-container">{po.po_number}</Td>
                    <Td className="font-mono-data">{formatCurrency(po.total_amount)}</Td>
                    <Td><StatusBadge status={po.status} /></Td>
                    <Td className="text-text-secondary">{formatDate(po.created_at)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Card>
      )}

      {tab === 'performance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Spend', value: formatCurrency(perf?.total_spend ?? 0), icon: 'payments' },
            { label: 'Total POs', value: perf?.total_pos ?? 0, icon: 'shopping_cart' },
            { label: 'Win Rate', value: `${perf?.win_rate ?? 0}%`, icon: 'emoji_events' },
            { label: 'On-time Delivery', value: `${perf?.on_time_pct ?? 0}%`, icon: 'local_shipping' },
          ].map(m => (
            <Card key={m.label}>
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-[20px] text-secondary-container">{m.icon}</span>
                <span className="text-label-caps text-text-secondary uppercase">{m.label}</span>
              </div>
              <p className="text-headline-md text-text-primary font-bold">{m.value}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
