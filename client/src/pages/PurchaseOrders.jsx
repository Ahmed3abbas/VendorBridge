import { useState } from 'react';
import { usePurchaseOrders, usePurchaseOrder, useUpdatePOStatus, useDownloadPO } from '../hooks/usePurchaseOrders';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { TableSkeleton, CardSkeleton } from '../components/LoadingSkeleton';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Table, Thead, Th, Tbody, Tr, Td } from '../components/ui/Table';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';
import useAuthStore from '../store/authStore';

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'ISSUED', label: 'Issued' },
  { value: 'ACKNOWLEDGED', label: 'Acknowledged' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const NEXT_STATUSES = {
  ISSUED: ['ACKNOWLEDGED', 'CANCELLED'],
  ACKNOWLEDGED: ['COMPLETED', 'CANCELLED'],
};

export default function PurchaseOrders() {
  const { user } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const { data, isLoading } = usePurchaseOrders({ status: statusFilter || undefined, limit: 20 });
  const { data: po, isLoading: poLoading } = usePurchaseOrder(selectedId);
  const { mutate: updateStatus } = useUpdatePOStatus();
  const { mutate: downloadPO, isPending: downloading } = useDownloadPO();

  const pos = data?.data ?? [];
  const isOfficer = ['ADMIN', 'PROCUREMENT_OFFICER'].includes(user?.role);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-lg text-text-primary">Purchase Orders</h1>
      <Tabs value={statusFilter} onChange={v => { setStatusFilter(v); setSelectedId(null); }} tabs={STATUS_TABS} />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 bg-surface border border-border-subtle rounded overflow-hidden">
          {isLoading ? <TableSkeleton rows={8} cols={5} /> : pos.length === 0 ? (
            <EmptyState icon="shopping_cart" title="No purchase orders found" />
          ) : (
            <Table>
              <Thead><Th>PO Number</Th><Th>Vendor</Th><Th>Total</Th><Th>Status</Th><Th>Date</Th></Thead>
              <Tbody>
                {pos.map(p => (
                  <Tr key={p.id} onClick={() => setSelectedId(p.id)}
                    className={selectedId === p.id ? 'bg-surface-hover/50' : ''}>
                    <Td className="font-mono-data text-secondary-container">{p.po_number}</Td>
                    <Td className="font-semibold">{p.vendor?.name}</Td>
                    <Td className="font-mono-data">{formatCurrency(p.total_amount)}</Td>
                    <Td><StatusBadge status={p.status} /></Td>
                    <Td className="text-text-secondary">{formatDate(p.created_at)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </div>

        <div className="xl:col-span-2">
          {!selectedId ? (
            <div className="flex items-center justify-center h-48 bg-surface border border-border-subtle rounded text-text-secondary text-body-sm">
              Select a PO to view details
            </div>
          ) : poLoading ? <CardSkeleton /> : po ? (
            <div className="flex flex-col gap-4">
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono-data text-secondary-container text-headline-sm">{po.po_number}</p>
                    <p className="text-body-sm text-text-secondary">{po.vendor?.name}</p>
                  </div>
                  <StatusBadge status={po.status} />
                </div>
                <dl className="flex flex-col gap-2 text-body-sm">
                  {[
                    ['Issue Date', formatDate(po.issued_at ?? po.created_at)],
                    ['Delivery', formatDate(po.delivery_date ?? po.quotation?.delivery_date)],
                    ['Subtotal', formatCurrency(po.total_amount - (po.tax_amount ?? 0))],
                    ['GST (18%)', formatCurrency(po.tax_amount)],
                    ['Total', formatCurrency(po.total_amount)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <dt className="text-text-secondary">{label}</dt>
                      <dd className="text-text-primary font-semibold">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>

              <Card className="p-0">
                <div className="px-4 py-3 border-b border-border-subtle">
                  <p className="text-headline-sm text-text-primary">Items</p>
                </div>
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {po.items?.map((item, i) => (
                      <tr key={i} className="border-b border-border-subtle">
                        <td className="px-4 py-2 text-body-sm text-text-primary">{item.product_name}</td>
                        <td className="px-4 py-2 text-body-sm font-mono-data text-right text-text-secondary">{item.quantity} {item.unit}</td>
                        <td className="px-4 py-2 text-body-sm font-mono-data text-right">{formatCurrency(item.unit_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" icon="download" loading={downloading} onClick={() => downloadPO(po.id)}>
                  Download PDF
                </Button>
                {isOfficer && NEXT_STATUSES[po.status] && (
                  <Dropdown
                    trigger={<Button variant="outline" icon="more_vert">Update Status</Button>}
                    items={NEXT_STATUSES[po.status].map(s => ({
                      label: s,
                      onClick: () => updateStatus({ id: po.id, status: s }),
                    }))}
                  />
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
