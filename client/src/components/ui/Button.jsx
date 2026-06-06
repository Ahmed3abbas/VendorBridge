import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-primary-container text-on-primary-container hover:bg-surface-tint',
  secondary: 'bg-surface-variant text-on-surface hover:bg-surface-bright border border-border-subtle',
  danger: 'bg-[#EF444420] text-accent-red hover:bg-[#EF444430]',
  ghost: 'text-text-primary hover:bg-surface-hover',
  outline: 'border border-border-subtle text-text-primary hover:bg-surface-hover',
};

const sizes = {
  sm: 'px-3 py-1.5 text-body-sm',
  md: 'px-4 py-2 text-body-sm',
  lg: 'px-5 py-2.5 text-body-md',
};

export default function Button({ variant = 'primary', size = 'md', className, loading, icon, children, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 rounded font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="material-symbols-outlined text-[16px]">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
