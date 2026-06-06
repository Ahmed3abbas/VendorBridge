import { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

export default function Dropdown({ trigger, items, className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={cn('relative', className)} ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-[160px] bg-surface border border-border-subtle rounded shadow-[0_4px_16px_rgba(0,0,0,0.4)] z-50 py-1">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => { setOpen(false); item.onClick?.(); }}
              className={cn(
                'w-full flex items-center gap-2 px-4 py-2 text-body-sm text-left transition-colors hover:bg-surface-hover',
                item.danger ? 'text-accent-red' : 'text-text-primary'
              )}
            >
              {item.icon && <span className="material-symbols-outlined text-[16px]">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
