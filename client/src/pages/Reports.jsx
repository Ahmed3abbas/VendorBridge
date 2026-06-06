import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSpendTrend, useVendorPerformanceReport } from '../hooks/useReports';
import { formatCurrency, formatCurrencyCompact } from '../utils/formatCurrency';
import { CardSkeleton, TableSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import DateRangePicker from '../components/DateRangePicker';
import { Card } from '../components/ui/Card';
import { Table, Thead, Th, Tbody, Tr, Td } from '../components/ui/Table';
import Button from '../components/ui/Button';

function csvDownload(data, filename) {
  if (!data?.length) return;
  const keys = Object.keys(data[0]);
  const rows = [keys.join(','), ...data.map(row => keys.map(k => `"${row[k] ?? ''}"`).join(','))];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

const TOOLTIP_STYLE = {
  contentStyle: { background: '#1A1D27', border: '1px solid #2A2E3A', borderRadius: '8px', color: '#F1F3F5' },
  labelStyle: { color: '#9CA3AF', fontSize: '12px' },
};

export default function Reports() {
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const params = {
    from: dateRange.from || undefined,
    to: dateRange.to || undefined,
  };

  const { data: spendData, isLoading: spendLoading } = useSpendTrend(params);
  const { data: vendorData, isLoading: vendorLoading } = useVendorPerformanceReport();

  const spendTrend = spendData ?? [];
  const vendors = vendorData ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-headline-lg text-text-primary">Reports & Analytics</h1>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Spend Trend Bar Chart */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-headline-sm text-text-primary">Monthly Spend</h3>
          <Button variant="ghost" size="sm" icon="download"
            onClick={() => csvDownload(spendTrend, 'spend-trend.csv')}>
            Export CSV
          </Button>
        </div>
        {spendLoading ? <CardSkeleton /> : spendTrend.length === 0 ? (
          <EmptyState icon="bar_chart" title="No spend data available" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={spendTrend} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2E3A" />
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tickFormatter={v => formatCurrencyCompact(v)} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip {...TOOLTIP_STYLE} formatter={v => formatCurrency(v)} />
              <Bar dataKey="total" fill="#0566d9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* PO Trend Line Chart */}
      <Card>
        <h3 className="text-headline-sm text-text-primary mb-4">PO Count Trend</h3>
        {spendLoading ? <CardSkeleton /> : spendTrend.length === 0 ? (
          <EmptyState icon="show_chart" title="No PO trend data available" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={spendTrend} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2E3A" />
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} allowDecimals={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} />
              <Line type="monotone" dataKey="total" stroke="#0566d9" strokeWidth={1} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Vendor Performance Table */}
      <Card className="p-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h3 className="text-headline-sm text-text-primary">Vendor Performance</h3>
          <Button variant="ghost" size="sm" icon="download"
            onClick={() => csvDownload(vendors, 'vendor-performance.csv')}>
            Export CSV
          </Button>
        </div>
        {vendorLoading ? <TableSkeleton rows={6} cols={5} /> : vendors.length === 0 ? (
          <EmptyState icon="emoji_events" title="No vendor performance data" />
        ) : (
          <Table>
            <Thead>
              <Th>Vendor</Th><Th>Total Spend</Th><Th>POs</Th><Th>Win Rate</Th><Th>On-time %</Th>
            </Thead>
            <Tbody>
              {vendors.map((v, i) => (
                <Tr key={v.vendor_id ?? i}>
                  <Td className="font-semibold">{v.name}</Td>
                  <Td className="font-mono-data">{formatCurrency(v.total_spend)}</Td>
                  <Td className="font-mono-data">{v.total_pos}</Td>
                  <Td>
                    <span className="flex items-center gap-1">
                      <div className="w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                        <div className="h-full bg-primary-container rounded-full" style={{ width: `${v.win_rate ?? 0}%` }} />
                      </div>
                      <span className="font-mono-data text-[11px]">{v.win_rate ?? 0}%</span>
                    </span>
                  </Td>
                  <Td>
                    <span className="flex items-center gap-1">
                      <div className="w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                        <div className="h-full bg-secondary-container rounded-full" style={{ width: `${v.on_time_pct ?? 0}%` }} />
                      </div>
                      <span className="font-mono-data text-[11px]">{v.on_time_pct ?? 0}%</span>
                    </span>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
