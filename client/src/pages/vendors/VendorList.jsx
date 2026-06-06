import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendors } from '../../hooks/useVendors';
import useAuthStore from '../../store/authStore';
import { TableSkeleton } from '../../components/LoadingSkeleton';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Tabs } from '../../components/ui/Tabs';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../components/ui/Table';

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'BLACKLISTED', label: 'Blacklisted' },
];

export default function VendorList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useVendors({ search, status: status || undefined, page, limit: 15 });
  const vendors = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.totalPages ?? data?.pagination?.pages ?? 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-lg text-text-primary">Vendors</h1>
        {user?.role === 'ADMIN' && (
          <Button icon="add" onClick={() => navigate('/vendors/new')}>Add Vendor</Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input icon="search" placeholder="Search by name or GST..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="sm:w-[280px]" />
        </div>
        <Tabs value={status} onChange={v => { setStatus(v); setPage(1); }} tabs={STATUS_TABS} />
      </div>

      <div className="bg-surface border border-border-subtle rounded overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={8} cols={6} />
        ) : vendors.length === 0 ? (
          <EmptyState icon="storefront" title="No vendors found"
            description="Try adjusting your search or filters"
            action={user?.role === 'ADMIN' && (
              <Button onClick={() => navigate('/vendors/new')}>Add First Vendor</Button>
            )} />
        ) : (
          <Table>
            <Thead>
              <Th>Name</Th><Th>GST Number</Th><Th>Category</Th><Th>Status</Th><Th>Rating</Th><Th>Contact</Th>
            </Thead>
            <Tbody>
              {vendors.map(v => (
                <Tr key={v.id} onClick={() => navigate(`/vendors/${v.id}`)}>
                  <Td className="font-semibold">{v.name}</Td>
                  <Td className="font-mono-data text-text-secondary">{v.gst_number ?? '—'}</Td>
                  <Td className="text-text-secondary">{v.category}</Td>
                  <Td><StatusBadge status={v.status} /></Td>
                  <Td>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-accent-amber">star</span>
                      <span className="font-mono-data">{v.rating?.toFixed(1) ?? '—'}</span>
                    </span>
                  </Td>
                  <Td className="text-text-secondary">{v.contact_email}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-body-sm text-text-secondary">
          <span>{total} vendors total</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <span className="flex items-center px-3 text-text-primary">Page {page} / {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
