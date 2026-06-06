import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Select = forwardRef(({ className, label, error, options = [], placeholder, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-label-caps text-text-secondary uppercase">{label}</label>}
      <select
        ref={ref}
        className={cn(
          'w-full bg-surface-variant/50 border border-border-subtle rounded h-[40px] px-3 text-body-sm text-text-primary focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container transition-colors appearance-none',
          error && 'border-accent-red',
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error && <p className="text-[11px] text-accent-red">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
