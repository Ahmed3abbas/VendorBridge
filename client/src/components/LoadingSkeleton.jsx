import { cn } from '../utils/cn';

export function Skeleton({ className }) {
  return (
    <div className={cn('animate-pulse bg-surface-variant rounded', className)} />
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="bg-surface border border-border-subtle rounded overflow-hidden">
      <div className="p-4 border-b border-border-subtle">
        <Skeleton className="h-5 w-48" />
      </div>
      <table className="w-full">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b border-border-subtle h-[48px]">
              {Array.from({ length: cols }).map((_, j) => (
                <td key={j} className="px-4 py-3">
                  <Skeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-surface border border-border-subtle rounded p-6">
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export default Skeleton;
