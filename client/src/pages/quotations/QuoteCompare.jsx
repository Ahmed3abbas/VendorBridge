import { useParams, useNavigate } from 'react-router-dom';
import { useRFQ, useQuotationsForRFQ, useSelectQuotation } from '../../hooks/useRFQ';
import { CardSkeleton } from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';
import QuotationCompareTable from '../../components/QuotationCompareTable';
import ConfirmModal from '../../components/ConfirmModal';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/StatusBadge';
import { Card } from '../../components/ui/Card';
import { useState } from 'react';

export default function QuoteCompare() {
  const { rfqId } = useParams();
  const navigate = useNavigate();
  const [selectId, setSelectId] = useState(null);

  const { data: rfq, isLoading: rfqLoading } = useRFQ(rfqId);
  const { data: quotations, isLoading: qLoading } = useQuotationsForRFQ(rfqId);
  const { mutate: selectQuotation, isPending } = useSelectQuotation();

  if (rfqLoading || qLoading) return <CardSkeleton />;

  const submittedQuotes = quotations?.filter(q => q.status === 'SUBMITTED' || q.status === 'SELECTED') ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" icon="arrow_back" onClick={() => navigate(`/rfq/${rfqId}`)} />
        <div className="flex-1">
          <h1 className="text-headline-lg text-text-primary">Compare Quotations</h1>
          <p className="text-body-sm text-text-secondary">{rfq?.title}</p>
        </div>
        <StatusBadge status={rfq?.status} />
      </div>

      {submittedQuotes.length < 2 ? (
        <EmptyState icon="compare" title="Not enough quotations"
          description="At least 2 submitted quotations are needed to compare."
          action={<Button variant="outline" onClick={() => navigate(`/rfq/${rfqId}`)}>Back to RFQ</Button>} />
      ) : (
        <Card className="p-0">
          <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
            <h3 className="text-headline-sm text-text-primary">{submittedQuotes.length} Quotations</h3>
            <p className="text-body-sm text-text-secondary">Lowest price per row is highlighted in green</p>
          </div>
          <QuotationCompareTable
            quotations={submittedQuotes}
            canSelect={rfq?.status === 'OPEN'}
            onSelect={(id) => setSelectId(id)}
          />
        </Card>
      )}

      <ConfirmModal
        open={!!selectId}
        title="Select this vendor?"
        message="This will send an approval request to the manager. A Purchase Order will be generated upon approval."
        confirmLabel="Select & Request Approval"
        onConfirm={() => selectQuotation(selectId, { onSuccess: () => { setSelectId(null); navigate('/rfq'); } })}
        onCancel={() => setSelectId(null)}
      />
    </div>
  );
}
