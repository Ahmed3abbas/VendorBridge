import { useState } from 'react';
import { useInvoices, useInvoice, useCreateInvoice, useUpdateInvoiceStatus, useDownloadInvoice, useSendInvoiceEmail } from '../hooks/useInvoice';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { TableSkeleton, CardSkeleton } from '../components/LoadingSkeleton';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import InvoicePrintView from '../components/InvoicePrintView';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Table, Thead, Th, Tbody, Tr, Td } from '../components/ui/Table';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';
import Dialog from '../components/ui/Dialog';
import Select from '../components/ui/Select';
import useAuthStore from '../store/authStore';

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SENT', label: 'Sent' },
  { value: 'PAID', label: 'Paid' },
  { value: 'OVERDUE', label: 'Overdue' },
];

export default function Invoices() {
  const { user } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [genOpen, setGenOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState('');

  const { data, isLoading } = useInvoices({ status: statusFilter || undefined, limit: 20 });
  const { data: invoice, isLoading: invLoading } = useInvoice(selectedId);
  const { data: poData } = usePurchaseOrders({ status: 'ACKNOWLEDGED', limit: 100 });
  const { mutate: createInvoice, isPending: creating } = useCreateInvoice();
  const { mutate: updateStatus } = useUpdateInvoiceStatus();
  const { mutate: downloadInvoice, isPending: downloading } = useDownloadInvoice();
  const { mutate: sendEmail, isPending: sending } = useSendInvoiceEmail();

  const invoices = data?.data ?? [];
  const pos = poData?.data ?? [];
  const isOfficer = ['ADMIN', 'PROCUREMENT_OFFICER'].includes(user?.role);

  function handleGenerate() {
    if (!selectedPO) return;
    createInvoice({ po_id: selectedPO }, {
      onSuccess: () => { setGenOpen(false); setSelectedPO(''); },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-lg text-text-primary">Invoices</h1>
        {isOfficer && (
          <Button icon="add" onClick={() => setGenOpen(true)}>Generate Invoice</Button>
        )}
      </div>

      <Tabs value={statusFilter} onChange={v => { setStatusFilter(v); setSelectedId(null); }} tabs={STATUS_TABS} />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 bg-surface border border-border-subtle rounded overflow-hidden">
          {isLoading ? <TableSkeleton rows={8} cols={5} /> : invoices.length === 0 ? (
            <EmptyState icon="receipt" title="No invoices found" />
          ) : (
            <Table>
              <Thead><Th>Invoice #</Th><Th>PO #</Th><Th>Vendor</Th><Th>Total</Th><Th>Status</Th></Thead>
              <Tbody>
                {invoices.map(inv => (
                  <Tr key={inv.id} onClick={() => setSelectedId(inv.id)}
                    className={selectedId === inv.id ? 'bg-surface-hover/50' : ''}>
                    <Td className="font-mono-data text-secondary-container">{inv.invoice_number}</Td>
                    <Td className="font-mono-data text-text-secondary">{inv.purchase_order?.po_number}</Td>
                    <Td className="font-semibold">{inv.purchase_order?.vendor?.name}</Td>
                    <Td className="font-mono-data">{formatCurrency(inv.total)}</Td>
                    <Td><StatusBadge status={inv.status} /></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </div>

        <div className="xl:col-span-2">
          {!selectedId ? (
            <div className="flex items-center justify-center h-48 bg-surface border border-border-subtle rounded text-text-secondary text-body-sm">
              Select an invoice to view details
            </div>
          ) : invLoading ? <CardSkeleton /> : invoice ? (
            <div className="flex flex-col gap-4">
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono-data text-secondary-container text-headline-sm">{invoice.invoice_number}</p>
                    <p className="text-body-sm text-text-secondary">{invoice.purchase_order?.vendor?.name}</p>
                  </div>
                  <StatusBadge status={invoice.status} />
                </div>
                <dl className="flex flex-col gap-2 text-body-sm">
                  {[
                    ['Date', formatDate(invoice.created_at)],
                    ['PO Number', invoice.purchase_order?.po_number],
                    ['Subtotal', formatCurrency(invoice.subtotal)],
                    ['GST (18%)', formatCurrency(invoice.tax_amount)],
                    ['Total', formatCurrency(invoice.total)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <dt className="text-text-secondary">{label}</dt>
                      <dd className="text-text-primary font-semibold">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>

              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" icon="download" loading={downloading} onClick={() => downloadInvoice(invoice.id)}>
                  PDF
                </Button>
                <Button variant="outline" icon="print" onClick={() => window.print()}>Print</Button>
                {isOfficer && (
                  <>
                    <Button variant="outline" icon="email" loading={sending} onClick={() => sendEmail(invoice.id)}>
                      Send Email
                    </Button>
                    <Dropdown
                      trigger={<Button variant="outline" icon="more_vert">Status</Button>}
                      items={['PAID', 'OVERDUE'].map(s => ({
                        label: s,
                        onClick: () => updateStatus({ id: invoice.id, status: s }),
                      }))}
                    />
                  </>
                )}
              </div>

              <div className="hidden print:block">
                <InvoicePrintView invoice={invoice} />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Dialog open={genOpen} onClose={() => setGenOpen(false)} title="Generate Invoice">
        <div className="flex flex-col gap-4">
          <p className="text-body-sm text-text-secondary">Select an acknowledged Purchase Order to generate an invoice.</p>
          <Select
            label="Purchase Order"
            placeholder="Select PO..."
            value={selectedPO}
            onChange={e => setSelectedPO(e.target.value)}
            options={pos.map(p => ({ value: p.id, label: `${p.po_number} — ${p.vendor?.name}` }))}
          />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setGenOpen(false)}>Cancel</Button>
            <Button loading={creating} onClick={handleGenerate} disabled={!selectedPO}>Generate</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
