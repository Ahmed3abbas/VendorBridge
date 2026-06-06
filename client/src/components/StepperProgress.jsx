import { cn } from '../utils/cn';

export default function StepperProgress({ steps, current }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-body-sm font-semibold border-2 transition-all',
                  done
                    ? 'bg-primary-container border-primary-container text-on-primary-container'
                    : active
                    ? 'border-secondary-container text-secondary-container bg-secondary-container/10'
                    : 'border-border-subtle text-text-secondary bg-surface'
                )}
              >
                {done ? (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  'text-[11px] mt-1 whitespace-nowrap',
                  active ? 'text-text-primary font-semibold' : done ? 'text-primary-container' : 'text-text-secondary'
                )}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-[2px] mb-5 mx-2',
                  done ? 'bg-primary-container' : 'bg-border-subtle'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
