import { useState } from 'react';
import { useApprovals, useApproveQuotation, useRejectQuotation } from '../hooks/useApprovals';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { TableSkeleton } from '../components/LoadingSkeleton';
import StatusBadge from '../components/StatusBadge';
import ApprovalTimeline from '../components/ApprovalTimeline';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import { Card } from '../components/ui/Card';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';

export default function Approvals() {
  const { data: approvals, isLoading } = useApprovals();
  const { mutate: approve, isPending: approving } = useApproveQuotation();
  const { mutate: reject, isPending: rejecting } = useRejectQuotation();

  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(null); // 'approve' | 'reject'
  const [remarks, setRemarks] = useState('');

  const list = approvals ?? [];

  function handleAction(type) {
    if (!selected) return;
    const fn = type === 'approve' ? approve : reject;
    fn({ id: selected.id, remarks }, {
      onSuccess: () => { setModal(null); setSelected(null); setRemarks(''); },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-lg text-text-primary">Approval Queue</h1>

      {isLoading ? (
        <TableSkeleton rows={5} cols={4} />
      ) : list.length === 0 ? (
        <EmptyState icon="fact_check" title="No pending approvals" description="All quotations have been reviewed." />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* List panel */}
          <div className="flex flex-col gap-3">
            {list.map(approval => (
              <Card
                key={approval.id}
                className={`cursor-pointer transition-colors hover:bg-surface-hover ${selected?.id === approval.id ? 'border-secondary-container' : ''}`}
                onClick={() => setSelected(approval)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-body-sm font-semibold text-text-primary">{approval.quotation?.rfq?.title}</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">{approval.quotation?.vendor?.name}</p>
                  </div>
                  <StatusBadge status={approval.status} />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-headline-sm text-text-primary font-bold">
                    {formatCurrency(approval.quotation?.total_amount)}
                  </span>
                  <span className="text-[11px] text-text-secondary">
                    Delivery: {formatDate(approval.quotation?.delivery_date)}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* Detail panel */}
          {selected ? (
            <div className="flex flex-col gap-4">
              <Card>
                <h3 className="text-headline-sm text-text-primary mb-4">Workflow Timeline</h3>
                <ApprovalTimeline approval={selected} />
              </Card>

              <Card>
                <h3 className="text-headline-sm text-text-primary mb-4">Quotation Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border-subtle">
                        {['Item', 'Qty', 'Unit Price', 'Subtotal'].map(h => (
                          <th key={h} className="px-4 py-2 text-label-caps text-text-secondary uppercase font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selected.quotation?.items?.map((item, i) => (
                        <tr key={i} className="border-b border-border-subtle">
                          <td className="px-4 py-2 text-body-sm font-semibold text-text-primary">{item.rfq_item?.product_name}</td>
                          <td className="px-4 py-2 text-body-sm font-mono-data">{item.rfq_item?.quantity} {item.rfq_item?.unit}</td>
                          <td className="px-4 py-2 text-body-sm font-mono-data">{formatCurrency(item.unit_price)}</td>
                          <td className="px-4 py-2 text-body-sm font-mono-data">{formatCurrency(item.unit_price * item.rfq_item?.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-3">
                  <span className="text-headline-sm text-text-primary font-bold">
                    Total: {formatCurrency(selected.quotation?.total_amount)}
                  </span>
                </div>
              </Card>

              {selected.status === 'PENDING' && (
                <div className="flex gap-3">
                  <Button variant="danger" icon="close" className="flex-1 justify-center"
                    onClick={() => setModal('reject')}>Reject</Button>
                  <Button icon="check" className="flex-1 justify-center"
                    onClick={() => setModal('approve')}>Approve</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-text-secondary text-body-sm bg-surface border border-border-subtle rounded">
              Select an approval to review
            </div>
          )}
        </div>
      )}

      <ConfirmModal open={modal === 'approve'} title="Approve Quotation?"
        message="A Purchase Order will be automatically generated."
        confirmLabel="Approve" onCancel={() => setModal(null)}
        onConfirm={() => handleAction('approve')}>
        <Textarea placeholder="Optional remarks..." rows={2} value={remarks} onChange={e => setRemarks(e.target.value)} />
      </ConfirmModal>

      <ConfirmModal open={modal === 'reject'} title="Reject Quotation?"
        message="The vendor will be notified of the rejection."
        confirmLabel="Reject" confirmClass="bg-accent-red text-white hover:bg-red-700"
        onCancel={() => setModal(null)} onConfirm={() => handleAction('reject')}>
        <Textarea placeholder="Reason for rejection (recommended)..." rows={2} value={remarks} onChange={e => setRemarks(e.target.value)} />
      </ConfirmModal>
    </div>
  );
}
