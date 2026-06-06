export default function EmptyState({ icon = 'inbox', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="material-symbols-outlined text-[48px] text-text-secondary mb-4">{icon}</span>
      <h3 className="text-headline-sm text-text-primary mb-1">{title}</h3>
      {description && <p className="text-body-md text-text-secondary mb-6 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}
