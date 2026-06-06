import { useEffect } from 'react';

let toasts = [];
let listeners = [];

function notify() {
  listeners.forEach((fn) => fn([...toasts]));
}

export const toast = {
  success: (msg) => add(msg, 'success'),
  error: (msg) => add(msg, 'error'),
  info: (msg) => add(msg, 'info'),
};

function add(message, type) {
  const id = Date.now();
  toasts = [{ id, message, type }, ...toasts].slice(0, 5);
  notify();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, 4000);
}

import { useState } from 'react';

export function Toaster() {
  const [list, setList] = useState([]);

  useEffect(() => {
    listeners.push(setList);
    return () => { listeners = listeners.filter((l) => l !== setList); };
  }, []);

  const icons = { success: 'check_circle', error: 'error', info: 'info' };
  const colors = { success: 'text-primary-container', error: 'text-accent-red', info: 'text-secondary-container' };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {list.map((t) => (
        <div key={t.id} className="bg-surface border border-border-subtle rounded shadow-lg px-4 py-3 flex items-center gap-3 min-w-[280px] pointer-events-auto animate-in slide-in-from-right">
          <span className={`material-symbols-outlined text-[18px] ${colors[t.type]}`}>{icons[t.type]}</span>
          <span className="text-body-sm text-text-primary">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export default toast;
