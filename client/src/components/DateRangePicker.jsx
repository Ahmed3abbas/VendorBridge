import { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';

export default function DateRangePicker({ value = { from: '', to: '' }, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-body-sm text-text-secondary">From</span>
      <input
        type="date"
        value={value.from}
        onChange={e => onChange({ ...value, from: e.target.value })}
        className="bg-surface-variant/50 border border-border-subtle rounded h-[36px] px-3 text-body-sm text-text-primary focus:outline-none focus:border-secondary-container transition-colors"
      />
      <span className="text-body-sm text-text-secondary">To</span>
      <input
        type="date"
        value={value.to}
        onChange={e => onChange({ ...value, to: e.target.value })}
        className="bg-surface-variant/50 border border-border-subtle rounded h-[36px] px-3 text-body-sm text-text-primary focus:outline-none focus:border-secondary-container transition-colors"
      />
      {(value.from || value.to) && (
        <Button variant="ghost" size="sm" icon="close" onClick={() => onChange({ from: '', to: '' })} />
      )}
    </div>
  );
}
