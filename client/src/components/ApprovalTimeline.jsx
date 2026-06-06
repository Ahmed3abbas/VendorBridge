import { formatDateTime } from '../utils/formatDate';

const STEPS = [
  { key: 'rfq',       label: 'RFQ Created',        icon: 'request_quote' },
  { key: 'quote',     label: 'Quote Submitted',     icon: 'description' },
  { key: 'approval',  label: 'Pending Approval',    icon: 'fact_check' },
  { key: 'po',        label: 'PO Generated',        icon: 'shopping_cart' },
];

export default function ApprovalTimeline({ approval }) {
  const q = approval?.quotation;
  const timestamps = {
    rfq: q?.rfq?.created_at,
    quote: q?.created_at,
    approval: approval?.created_at,
    po: approval?.status === 'APPROVED' ? approval?.acted_at : null,
  };

  const activeStep =
    approval?.status === 'APPROVED' ? 3
    : approval?.status === 'REJECTED' ? 2
    : q ? 2
    : 1;

  return (
    <div className="flex flex-col gap-0">
      {STEPS.map((step, i) => {
        const done = i < activeStep;
        const active = i === activeStep;
        const rejected = approval?.status === 'REJECTED' && i === 2;
        return (
          <div key={step.key} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  rejected
                    ? 'bg-[#EF444420] text-accent-red'
                    : done
                    ? 'bg-[#22C55E20] text-primary-container'
                    : active
                    ? 'bg-[#0566d920] text-secondary-container'
                    : 'bg-surface-variant text-text-secondary'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {rejected ? 'close' : done ? 'check' : step.icon}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-[2px] h-8 ${done ? 'bg-primary-container' : 'bg-border-subtle'}`} />
              )}
            </div>
            <div className="pb-4">
              <p className={`text-body-sm font-semibold ${done || active ? 'text-text-primary' : 'text-text-secondary'}`}>
                {step.label}
              </p>
              {timestamps[step.key] && (
                <p className="text-[11px] text-text-secondary">{formatDateTime(timestamps[step.key])}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
