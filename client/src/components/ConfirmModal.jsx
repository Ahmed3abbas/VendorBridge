import { cn } from '../utils/cn';

export default function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', confirmClass, onConfirm, onCancel, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative bg-surface border border-border-subtle rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full max-w-md mx-4 p-6">
        <h3 className="text-headline-sm text-text-primary mb-2">{title}</h3>
        {message && <p className="text-body-md text-text-secondary mb-4">{message}</p>}
        {children}
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-body-sm border border-border-subtle text-text-primary rounded hover:bg-surface-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              'px-4 py-2 text-body-sm rounded font-semibold transition-all active:scale-95',
              confirmClass ?? 'bg-primary-container text-on-primary-container hover:bg-surface-tint'
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
