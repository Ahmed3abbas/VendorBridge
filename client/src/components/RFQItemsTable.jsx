export default function RFQItemsTable({ items = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-hover/50">
            {['#', 'Product', 'Qty', 'Unit', 'Description'].map((h) => (
              <th key={h} className="px-4 py-3 text-label-caps text-text-secondary uppercase font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.id ?? i} className="border-b border-border-subtle h-[48px] hover:bg-surface-hover/30">
              <td className="px-4 py-3 text-body-sm text-text-secondary">{i + 1}</td>
              <td className="px-4 py-3 text-body-sm font-semibold text-text-primary">{item.product_name}</td>
              <td className="px-4 py-3 text-body-sm text-text-primary font-mono-data">{item.quantity}</td>
              <td className="px-4 py-3 text-body-sm text-text-secondary">{item.unit}</td>
              <td className="px-4 py-3 text-body-sm text-text-secondary">{item.description ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
