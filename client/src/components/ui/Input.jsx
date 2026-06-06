import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({ className, label, error, icon, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-label-caps text-text-secondary uppercase">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[18px]">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-surface-variant/50 border border-border-subtle rounded h-[40px] px-3 text-body-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container transition-colors',
            icon && 'pl-9',
            error && 'border-accent-red focus:border-accent-red focus:ring-accent-red',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-[11px] text-accent-red">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
