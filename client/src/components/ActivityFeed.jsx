import { timeAgo } from '../utils/formatDate';

export default function ActivityFeed({ logs = [] }) {
  return (
    <div className="flex flex-col gap-0">
      {logs.map((log, i) => (
        <div key={log.id} className="flex items-start gap-4 relative">
          {/* Connector line */}
          {i < logs.length - 1 && (
            <div className="absolute left-4 top-8 bottom-0 w-[2px] bg-border-subtle" />
          )}

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-surface-variant border border-border-subtle flex items-center justify-center text-body-sm font-semibold text-text-primary flex-shrink-0 z-10">
            {log.user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>

          {/* Content */}
          <div className="flex-1 pb-6">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-body-sm font-semibold text-text-primary">{log.user?.name}</span>
              <span className="text-[11px] text-text-secondary uppercase tracking-wide bg-surface-variant px-1.5 py-0.5 rounded">
                {log.user?.role?.replace('_', ' ')}
              </span>
            </div>
            <p className="text-body-sm text-text-secondary mt-0.5">
              <span className="font-semibold text-text-primary">{log.action.replace(/_/g, ' ')}</span>
              {' on '}
              <span className="text-secondary-container">{log.entity_type}</span>
              {' '}
              <span className="font-mono-data text-[11px]">{log.entity_id?.slice(0, 8)}</span>
            </p>
            <p className="text-[11px] text-text-secondary mt-1">{timeAgo(log.created_at)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
