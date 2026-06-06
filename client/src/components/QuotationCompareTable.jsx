import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

export default function QuotationCompareTable({ quotations = [], onSelect, canSelect }) {
  if (!quotations.length) return null;

  // Build rows from first quotation's items as reference
  const rfqItems = quotations[0]?.items?.map((qi) => qi.rfq_item) ?? [];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-body-sm">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-hover/50">
            <th className="px-4 py-3 text-label-caps text-text-secondary uppercase font-semibold min-w-[160px]">
              Item
            </th>
            <th className="px-4 py-3 text-label-caps text-text-secondary uppercase font-semibold">
              Qty
            </th>
            {quotations.map((q) => (
              <th key={q.id} className="px-4 py-3 text-label-caps text-text-secondary uppercase font-semibold min-w-[140px]">
                <div className="flex flex-col gap-1">
                  <span className="text-text-primary">{q.vendor.name}</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">star</span>
                    {q.vendor.rating?.toFixed(1) ?? '—'}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rfqItems.map((rfqItem) => {
            const prices = quotations.map((q) => {
              const qi = q.items.find((i) => i.rfq_item_id === rfqItem.id);
              return qi?.unit_price ?? Infinity;
            });
            const minPrice = Math.min(...prices);

            return (
              <tr key={rfqItem.id} className="border-b border-border-subtle h-[48px] hover:bg-surface-hover/30">
                <td className="px-4 py-3 font-semibold text-text-primary">{rfqItem.product_name}</td>
                <td className="px-4 py-3 text-text-secondary font-mono-data">
                  {rfqItem.quantity} {rfqItem.unit}
                </td>
                {quotations.map((q) => {
                  const qi = q.items.find((i) => i.rfq_item_id === rfqItem.id);
                  const isLowest = qi?.unit_price === minPrice;
                  return (
                    <td
                      key={q.id}
                      className={`px-4 py-3 font-mono-data ${isLowest ? 'text-primary-container font-semibold' : 'text-text-primary'}`}
                    >
                      {qi ? formatCurrency(qi.unit_price) : '—'}
                      {isLowest && qi && (
                        <span className="ml-1 text-[10px] bg-[#22C55E20] text-primary-container px-1 py-0.5 rounded">
                          LOWEST
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}

          {/* Totals row */}
          <tr className="border-b border-border-subtle bg-surface-hover/50 font-semibold">
            <td className="px-4 py-3 text-text-primary" colSpan={2}>
              Total Amount
            </td>
            {quotations.map((q) => (
              <td key={q.id} className="px-4 py-3 font-mono-data text-text-primary">
                {formatCurrency(q.total_amount)}
              </td>
            ))}
          </tr>

          {/* Delivery row */}
          <tr className="border-b border-border-subtle">
            <td className="px-4 py-3 text-text-secondary" colSpan={2}>
              Delivery Date
            </td>
            {quotations.map((q) => (
              <td key={q.id} className="px-4 py-3 text-body-sm text-text-primary">
                {formatDate(q.delivery_date)}
              </td>
            ))}
          </tr>

          {/* Notes row */}
          <tr className="border-b border-border-subtle">
            <td className="px-4 py-3 text-text-secondary" colSpan={2}>Notes</td>
            {quotations.map((q) => (
              <td key={q.id} className="px-4 py-3 text-body-sm text-text-secondary">{q.notes ?? '—'}</td>
            ))}
          </tr>

          {/* Select row */}
          {canSelect && (
            <tr>
              <td className="px-4 py-3" colSpan={2} />
              {quotations.map((q) => (
                <td key={q.id} className="px-4 py-3">
                  {q.status === 'SUBMITTED' && (
                    <button
                      onClick={() => onSelect(q.id)}
                      className="bg-primary-container text-on-primary-container text-body-sm font-semibold px-3 py-1.5 rounded hover:bg-surface-tint transition-all active:scale-95"
                    >
                      Select Vendor
                    </button>
                  )}
                  {q.status === 'SELECTED' && (
                    <span className="text-body-sm text-primary-container font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Selected
                    </span>
                  )}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
