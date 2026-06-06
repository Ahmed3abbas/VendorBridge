import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Textarea = forwardRef(({ className, label, error, rows = 3, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-label-caps text-text-secondary uppercase">{label}</label>}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'w-full bg-surface-variant/50 border border-border-subtle rounded px-3 py-2 text-body-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container transition-colors resize-none',
          error && 'border-accent-red',
          className
        )}
        {...props}
      />
      {error && <p className="text-[11px] text-accent-red">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
