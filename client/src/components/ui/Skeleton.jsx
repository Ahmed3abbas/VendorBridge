import { cn } from '../../utils/cn';

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse bg-surface-variant rounded', className)} />;
}

export default Skeleton;
