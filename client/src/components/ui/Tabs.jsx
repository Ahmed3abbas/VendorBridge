import { cn } from '../../utils/cn';

export function Tabs({ value, onChange, tabs, className }) {
  return (
    <div className={cn('flex gap-1 border-b border-border-subtle', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'px-4 py-2 text-body-sm font-semibold transition-all border-b-2 -mb-px',
            value === tab.value
              ? 'border-secondary-container text-secondary-container'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          )}
        >
          {tab.label}
          {tab.count != null && (
            <span className={cn('ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full', value === tab.value ? 'bg-secondary-container/20' : 'bg-surface-variant')}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
