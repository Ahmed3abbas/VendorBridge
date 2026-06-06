import { cn } from '../../utils/cn';

export default function Badge({ children, className }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-label-caps font-semibold', className)}>
      {children}
    </span>
  );
}
