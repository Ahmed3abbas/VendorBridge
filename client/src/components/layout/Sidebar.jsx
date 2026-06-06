import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../utils/constants';
import useAuthStore from '../../store/authStore';
import { cn } from '../../utils/cn';

export default function Sidebar() {
  const { user } = useAuthStore();
  const location = useLocation();

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  return (
    <nav className="bg-surface border-r border-border-subtle fixed left-0 top-0 h-full w-[240px] pt-[56px] flex flex-col z-40 hidden md:flex">
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="flex flex-col gap-1 px-2">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <li key={item.label}>
                <NavLink
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded text-body-sm transition-all active:scale-[0.98]',
                    isActive
                      ? 'bg-surface-hover text-primary border-l-4 border-primary font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-hover'
                  )}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-border-subtle">
        <ul className="flex flex-col gap-1">
          {[
            { label: 'Settings', icon: 'settings', path: '#' },
            { label: 'Support',  icon: 'help',     path: '#' },
          ].map((item) => (
            <li key={item.label}>
              <a
                href={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded text-body-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-hover transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
