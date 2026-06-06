import { cn } from '../../utils/cn';

export function Avatar({ name, size = 'md', className }) {
  const sizes = { sm: 'w-6 h-6 text-[11px]', md: 'w-8 h-8 text-body-sm', lg: 'w-10 h-10 text-body-md' };
  return (
    <div className={cn('rounded-full bg-surface-variant border border-border-subtle flex items-center justify-center font-semibold text-text-primary flex-shrink-0', sizes[size], className)}>
      {name?.[0]?.toUpperCase() ?? '?'}
    </div>
  );
}

export default Avatar;
