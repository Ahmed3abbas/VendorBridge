import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

export default function InvoicePrintView({ invoice }) {
  if (!invoice) return null;

  return (
    <div className="print:block bg-print-white text-black p-10 font-sans max-w-[800px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold">TAX INVOICE</h1>
          <p className="text-sm text-gray-600 mt-1">GST Compliant</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">VendorBridge</p>
          <p className="text-sm text-gray-600">procurement@vendorbridge.com</p>
        </div>
      </div>

      {/* Invoice Meta */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <p className="text-xs font-bold uppercase text-gray-500 mb-1">Bill To</p>
          <p className="font-semibold">{invoice.vendor?.name}</p>
          <p className="text-sm text-gray-600">{invoice.vendor?.contact_email}</p>
          <p className="text-sm text-gray-600">{invoice.vendor?.gst_number && `GST: ${invoice.vendor.gst_number}`}</p>
        </div>
        <div className="text-right">
          <dl className="flex flex-col gap-1 text-sm">
            {[
              ['Invoice Number', invoice.invoice_number],
              ['PO Number', invoice.purchase_order?.po_number],
              ['Invoice Date', formatDate(invoice.created_at)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-gray-500">{label}:</dt>
                <dd className="font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse mb-6 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2 text-left">#</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Description</th>
            <th className="border border-gray-300 px-3 py-2 text-right">Qty</th>
            <th className="border border-gray-300 px-3 py-2 text-right">Unit Price</th>
            <th className="border border-gray-300 px-3 py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items?.map((item, i) => (
            <tr key={i}>
              <td className="border border-gray-300 px-3 py-2">{i + 1}</td>
              <td className="border border-gray-300 px-3 py-2">{item.product_name}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{item.quantity} {item.unit}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{formatCurrency(item.unit_price)}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{formatCurrency(item.unit_price * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <dl className="w-[280px] flex flex-col gap-1 text-sm">
          <div className="flex justify-between"><dt className="text-gray-500">Subtotal:</dt><dd>{formatCurrency(invoice.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-500">CGST (9%):</dt><dd>{formatCurrency(invoice.tax_amount / 2)}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-500">SGST (9%):</dt><dd>{formatCurrency(invoice.tax_amount / 2)}</dd></div>
          <div className="flex justify-between border-t border-black pt-1 font-bold text-base">
            <dt>Total:</dt><dd>{formatCurrency(invoice.total ?? invoice.total_amount)}</dd>
          </div>
        </dl>
      </div>

      <p className="text-xs text-gray-400 text-center border-t border-gray-200 pt-4">
        This is a computer-generated invoice and does not require a signature.
      </p>
    </div>
  );
}
