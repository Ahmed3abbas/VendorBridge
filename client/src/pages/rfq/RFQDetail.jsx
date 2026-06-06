import { useParams, useNavigate } from 'react-router-dom';
import { useRFQ, useCloseRFQ, useQuotationsForRFQ } from '../../hooks/useRFQ';
import { formatDate, formatDateTime } from '../../utils/formatDate';
import { CardSkeleton } from '../../components/LoadingSkeleton';
import StatusBadge from '../../components/StatusBadge';
import RFQItemsTable from '../../components/RFQItemsTable';
import EmptyState from '../../components/EmptyState';
import ConfirmModal from '../../components/ConfirmModal';
import { Card } from '../../components/ui/Card';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/authStore';
import { useState } from 'react';

export default function RFQDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [closeOpen, setCloseOpen] = useState(false);

  const { data: rfq, isLoading } = useRFQ(id);
  const { data: quotations } = useQuotationsForRFQ(id);
  const { mutate: closeRFQ, isPending: closing } = useCloseRFQ();

  if (isLoading) return <div className="flex flex-col gap-4"><CardSkeleton /><CardSkeleton /></div>;
  if (!rfq) return <EmptyState icon="request_quote" title="RFQ not found" />;

  const canCompare = quotations?.length >= 2;
  const isOfficer = ['ADMIN', 'PROCUREMENT_OFFICER'].includes(user?.role);
  const isVendor = user?.role === 'VENDOR';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" icon="arrow_back" onClick={() => navigate('/rfq')} />
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-headline-lg text-text-primary">{rfq.title}</h1>
            <StatusBadge status={rfq.status} />
          </div>
          <p className="text-body-sm text-text-secondary">Created by {rfq.created_by?.name} · {formatDateTime(rfq.created_at)}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {isVendor && rfq.status === 'OPEN' && (
            <Button icon="edit_note" onClick={() => navigate(`/rfq/${id}/quote`)}>Submit Quote</Button>
          )}
          {isOfficer && canCompare && (
            <Button variant="outline" icon="compare" onClick={() => navigate(`/rfq/${id}/compare`)}>Compare Quotes</Button>
          )}
          {isOfficer && rfq.status === 'OPEN' && (
            <Button variant="danger" icon="lock" onClick={() => setCloseOpen(true)}>Close RFQ</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Deadline', value: formatDate(rfq.deadline), icon: 'calendar_today' },
          { label: 'Items', value: rfq.rfq_items?.length ?? 0, icon: 'list' },
          { label: 'Vendors Invited', value: rfq.rfq_vendors?.length ?? 0, icon: 'group' },
        ].map(m => (
          <Card key={m.label}>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[18px] text-secondary-container">{m.icon}</span>
              <span className="text-label-caps text-text-secondary uppercase">{m.label}</span>
            </div>
            <p className="text-headline-md text-text-primary font-bold">{m.value}</p>
          </Card>
        ))}
      </div>

      {rfq.description && (
        <Card>
          <h3 className="text-headline-sm text-text-primary mb-2">Description</h3>
          <p className="text-body-md text-text-secondary">{rfq.description}</p>
        </Card>
      )}

      {rfq.attachments?.length > 0 && (
        <Card>
          <h3 className="text-headline-sm text-text-primary mb-3">Attachments</h3>
          <ul className="flex flex-col gap-2">
            {rfq.attachments.map(a => (
              <li key={a.id} className="flex items-center justify-between bg-surface-variant/30 rounded px-3 py-2">
                <span className="flex items-center gap-2 text-body-sm text-text-primary truncate">
                  <span className="material-symbols-outlined text-[16px] text-secondary-container">attach_file</span>
                  {a.file_name}
                  <span className="text-[11px] text-text-secondary">({(a.file_size / 1024).toFixed(1)} KB)</span>
                </span>
                <a
                  href={a.file_path}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[12px] text-secondary-container hover:underline ml-4 shrink-0 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">download</span>
                  Download
                </a>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="p-0">
        <div className="px-6 py-4 border-b border-border-subtle">
          <h3 className="text-headline-sm text-text-primary">Line Items</h3>
        </div>
        <RFQItemsTable items={rfq.rfq_items ?? []} />
      </Card>

      {isOfficer && (
        <Card className="p-0">
          <div className="px-6 py-4 border-b border-border-subtle">
            <h3 className="text-headline-sm text-text-primary">Invited Vendors</h3>
          </div>
          {!rfq.rfq_vendors?.length ? (
            <EmptyState icon="group" title="No vendors invited" />
          ) : (
            <Table>
              <Thead><Th>Vendor</Th><Th>Category</Th><Th>Quote Status</Th></Thead>
              <Tbody>
                {rfq.rfq_vendors?.map(rv => (
                  <Tr key={rv.vendor_id}>
                    <Td className="font-semibold">{rv.vendor?.name}</Td>
                    <Td className="text-text-secondary">{rv.vendor?.category}</Td>
                    <Td>
                      <StatusBadge status={
                        quotations?.find(q => q.vendor_id === rv.vendor_id) ? 'SUBMITTED' : 'PENDING'
                      } />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Card>
      )}

      <ConfirmModal open={closeOpen} title="Close RFQ?"
        message="This will prevent vendors from submitting new quotations."
        confirmLabel="Close RFQ" confirmClass="bg-accent-red text-white hover:bg-red-700"
        onConfirm={() => closeRFQ(id, { onSuccess: () => setCloseOpen(false) })}
        onCancel={() => setCloseOpen(false)} />
    </div>
  );
}
