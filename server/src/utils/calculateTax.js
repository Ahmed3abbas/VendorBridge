export function calculateTax(subtotal, taxRate = 18) {
  const tax_amount = parseFloat(((subtotal * taxRate) / 100).toFixed(2));
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax_rate: taxRate,
    tax_amount,
    total: parseFloat((subtotal + tax_amount).toFixed(2)),
  };
}
