import { cn } from '../../utils/cn';

export function Separator({ className, orientation = 'horizontal' }) {
  return (
    <div
      className={cn(
        'bg-border-subtle',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
        className
      )}
    />
  );
}

export default Separator;
