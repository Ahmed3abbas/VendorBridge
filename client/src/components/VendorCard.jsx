import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function VendorCard({ vendor }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/vendors/${vendor.id}`)}
      className="bg-surface border border-border-subtle rounded p-4 hover:bg-surface-hover cursor-pointer transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-body-sm font-semibold text-text-primary">{vendor.name}</p>
          <p className="text-[11px] text-text-secondary">{vendor.category}</p>
        </div>
        <StatusBadge status={vendor.status} />
      </div>
      <div className="flex items-center gap-1 text-[11px] text-text-secondary">
        <span className="material-symbols-outlined text-[14px]">star</span>
        {vendor.rating?.toFixed(1) ?? '—'}
      </div>
    </div>
  );
}
