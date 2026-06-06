import { cn } from '../../utils/cn';

export function Table({ className, children }) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-left border-collapse">{children}</table>
    </div>
  );
}

export function Thead({ children }) {
  return (
    <thead>
      <tr className="border-b border-border-subtle bg-surface-hover/50">{children}</tr>
    </thead>
  );
}

export function Th({ children, className }) {
  return (
    <th className={cn('px-4 py-3 text-label-caps text-text-secondary uppercase font-semibold', className)}>
      {children}
    </th>
  );
}

export function Tbody({ children }) {
  return <tbody>{children}</tbody>;
}

export function Tr({ children, className, onClick }) {
  return (
    <tr
      className={cn('border-b border-border-subtle h-[48px] transition-colors', onClick && 'cursor-pointer hover:bg-surface-hover/30', className)}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function Td({ children, className }) {
  return <td className={cn('px-4 py-3 text-body-sm text-text-primary', className)}>{children}</td>;
}

export default Table;
