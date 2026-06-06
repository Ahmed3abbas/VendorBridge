import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRFQs } from '../../hooks/useRFQ';
import useAuthStore from '../../store/authStore';
import { TableSkeleton } from '../../components/LoadingSkeleton';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../components/ui/Table';
import { formatDate } from '../../utils/formatDate';

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'OPEN', label: 'Open' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function RFQList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useRFQs({ status: status || undefined, page, limit: 15 });
  const rfqs = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? data?.pagination?.pages ?? 1;

  const canCreate = ['ADMIN', 'PROCUREMENT_OFFICER'].includes(user?.role);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-lg text-text-primary">RFQs</h1>
        {canCreate && <Button icon="add" onClick={() => navigate('/rfq/new')}>Create RFQ</Button>}
      </div>

      <Tabs value={status} onChange={v => { setStatus(v); setPage(1); }} tabs={STATUS_TABS} />

      <div className="bg-surface border border-border-subtle rounded overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={8} cols={5} />
        ) : rfqs.length === 0 ? (
          <EmptyState icon="request_quote" title="No RFQs found"
            action={canCreate && <Button onClick={() => navigate('/rfq/new')}>Create First RFQ</Button>} />
        ) : (
          <Table>
            <Thead>
              <Th>Title</Th><Th>Items</Th><Th>Vendors</Th><Th>Deadline</Th><Th>Status</Th><Th>Quotes</Th>
            </Thead>
            <Tbody>
              {rfqs.map(rfq => (
                <Tr key={rfq.id} onClick={() => navigate(`/rfq/${rfq.id}`)}>
                  <Td className="font-semibold">{rfq.title}</Td>
                  <Td className="font-mono-data text-text-secondary">{rfq._count?.rfq_items ?? 0}</Td>
                  <Td className="font-mono-data text-text-secondary">{rfq._count?.rfq_vendors ?? 0}</Td>
                  <Td className="text-text-secondary">{formatDate(rfq.deadline)}</Td>
                  <Td><StatusBadge status={rfq.status} /></Td>
                  <Td className="font-mono-data">{rfq._count?.quotations ?? 0}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <span className="flex items-center px-3 text-body-sm text-text-primary">Page {page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
