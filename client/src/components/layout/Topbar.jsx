import { useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import useAuthStore from '../../store/authStore';
import { useLogout } from '../../hooks/useAuth';
import { useState, useRef, useEffect } from 'react';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/vendors': 'Vendors',
  '/rfq': 'RFQs',
  '/approvals': 'Approvals',
  '/purchase-orders': 'Purchase Orders',
  '/invoices': 'Invoices',
  '/reports': 'Reports',
  '/activity-log': 'Activity Log',
};

const ROLE_LABELS = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  PROCUREMENT_OFFICER: 'Officer',
  VENDOR: 'Vendor',
};

export default function Topbar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const logout = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const pageTitle =
    Object.entries(PAGE_TITLES).find(([key]) => location.pathname.startsWith(key))?.[1] ??
    'VendorBridge';

  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="bg-nav-top border-b border-border-subtle fixed top-0 left-0 w-full z-50 h-[56px] flex justify-between items-center px-8 md:pl-[272px]">
      <div className="flex items-center gap-4">
        <span className="text-headline-sm font-bold text-primary md:hidden">VendorBridge</span>
        <span className="hidden md:block text-headline-sm font-bold text-text-primary">{pageTitle}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[18px]">
            search
          </span>
          <input
            className="bg-surface border border-border-subtle rounded h-[36px] pl-9 pr-4 text-body-sm text-text-primary focus:border-secondary-container focus:outline-none focus:ring-1 focus:ring-secondary-container w-[220px] transition-colors placeholder:text-text-secondary"
            placeholder="Search..."
            type="text"
          />
        </div>

        <NotificationBell />

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 hover:bg-surface-hover rounded px-2 py-1 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-surface-variant border border-border-subtle flex items-center justify-center text-body-sm font-semibold text-text-primary">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-body-sm font-semibold text-text-primary leading-none">{user?.name}</span>
              <span className="text-[11px] text-text-secondary">{ROLE_LABELS[user?.role]}</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-text-secondary">expand_more</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-surface border border-border-subtle rounded shadow-[0_4px_16px_rgba(0,0,0,0.4)] z-50">
              <button
                onClick={() => { setMenuOpen(false); logout(); }}
                className="w-full flex items-center gap-2 px-4 py-3 text-body-sm text-accent-red hover:bg-surface-hover transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
