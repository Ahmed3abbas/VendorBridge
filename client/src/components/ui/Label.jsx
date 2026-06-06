import { cn } from '../../utils/cn';

export function Label({ children, className, required, ...props }) {
  return (
    <label className={cn('text-label-caps text-text-secondary uppercase', className)} {...props}>
      {children}
      {required && <span className="text-accent-red ml-0.5">*</span>}
    </label>
  );
}

export default Label;
