import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../../store/notificationStore';
import { timeAgo } from '../../utils/formatDate';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotificationStore();
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleClick(n) {
    markAsRead(n.id);
    setOpen(false);
    if (n.link) navigate(n.link);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-hover transition-colors rounded-full relative active:scale-95"
      >
        <span className="material-symbols-outlined text-[22px]">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-accent-red text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border-subtle rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
            <span className="text-headline-sm font-semibold text-text-primary">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-body-sm text-secondary-container hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <ul className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="px-4 py-6 text-center text-body-sm text-text-secondary">
                No notifications
              </li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`px-4 py-3 border-b border-border-subtle cursor-pointer hover:bg-surface-hover transition-colors ${!n.read ? 'bg-surface-hover/50' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && (
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-secondary-container flex-shrink-0" />
                    )}
                    <div className={!n.read ? '' : 'ml-4'}>
                      <p className="text-body-sm font-semibold text-text-primary">{n.title}</p>
                      <p className="text-body-sm text-text-secondary">{n.message}</p>
                      <p className="text-[11px] text-text-secondary mt-1">{timeAgo(n.timestamp)}</p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
