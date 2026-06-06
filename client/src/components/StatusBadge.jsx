import { STATUS_COLORS } from '../utils/constants';
import { cn } from '../utils/cn';

export default function StatusBadge({ status, className }) {
  const colorClass = STATUS_COLORS[status] ?? 'bg-[#9CA3AF20] text-[#9CA3AF]';
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-label-caps font-semibold uppercase tracking-wide',
        colorClass,
        className
      )}
    >
      {status}
    </span>
  );
}
