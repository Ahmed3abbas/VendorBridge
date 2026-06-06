import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

function toDate(value) {
  if (!value) return null;
  const d = typeof value === 'string' ? parseISO(value) : new Date(value);
  return isValid(d) ? d : null;
}

export function formatDate(value) {
  const d = toDate(value);
  return d ? format(d, 'dd MMM yyyy') : '—';
}

export function formatDateTime(value) {
  const d = toDate(value);
  return d ? format(d, 'dd MMM yyyy, h:mm a') : '—';
}

export function timeAgo(value) {
  const d = toDate(value);
  return d ? formatDistanceToNow(d, { addSuffix: true }) : '—';
}

export function formatDateForInput(value) {
  const d = toDate(value);
  return d ? format(d, "yyyy-MM-dd'T'HH:mm") : '';
}
