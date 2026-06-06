import { useState, useEffect, useRef } from 'react';
import { useActivityLogs } from '../hooks/useReports';
import { formatDate } from '../utils/formatDate';
import ActivityFeed from '../components/ActivityFeed';
import { TableSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { Card } from '../components/ui/Card';

const ENTITY_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'RFQ', label: 'RFQ' },
  { value: 'QUOTATION', label: 'Quotation' },
  { value: 'APPROVAL', label: 'Approval' },
  { value: 'PURCHASE_ORDER', label: 'Purchase Order' },
  { value: 'INVOICE', label: 'Invoice' },
  { value: 'VENDOR', label: 'Vendor' },
];

export default function ActivityLog() {
  const [page, setPage] = useState(1);
  const [entityType, setEntityType] = useState('');
  const [allLogs, setAllLogs] = useState([]);
  const bottomRef = useRef(null);

  const { data, isLoading, isFetching } = useActivityLogs({
    entity_type: entityType || undefined,
    page,
    limit: 20,
  });

  const hasMore = data?.pagination ? page < data.pagination.totalPages : false;

  useEffect(() => {
    if (data?.data) {
      setAllLogs(prev => page === 1 ? data.data : [...prev, ...data.data]);
    }
  }, [data, page]);

  useEffect(() => {
    setPage(1);
    setAllLogs([]);
  }, [entityType]);

  useEffect(() => {
    if (!bottomRef.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isFetching) {
        setPage(p => p + 1);
      }
    }, { threshold: 0.5 });
    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-lg text-text-primary">Activity Log</h1>
        <Select
          value={entityType}
          onChange={e => setEntityType(e.target.value)}
          options={ENTITY_TYPES}
          className="w-[180px]"
        />
      </div>

      <Card>
        {isLoading && page === 1 ? (
          <TableSkeleton rows={6} cols={1} />
        ) : allLogs.length === 0 ? (
          <EmptyState icon="history" title="No activity found" />
        ) : (
          <>
            <ActivityFeed logs={allLogs} />
            <div ref={bottomRef} className="py-2 text-center">
              {isFetching && <span className="text-body-sm text-text-secondary">Loading more...</span>}
              {!hasMore && allLogs.length > 0 && (
                <span className="text-body-sm text-text-secondary">— End of activity log —</span>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
