const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount) {
  if (amount == null) return '₹0.00';
  return formatter.format(amount);
}

export function formatCurrencyCompact(amount) {
  if (amount == null || amount === 0) return '₹0';
  
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  
  // 1 Crore = 10,000,000
  if (absAmount >= 10000000) {
    const crores = absAmount / 10000000;
    // Show 2 decimals if less than 10 Cr, otherwise 1 decimal
    const decimals = crores < 10 ? 2 : 1;
    return `${sign}₹${crores.toFixed(decimals)}Cr`;
  }
  
  // 1 Lakh = 100,000
  if (absAmount >= 100000) {
    const lakhs = absAmount / 100000;
    // Show 2 decimals if less than 10 L, otherwise 1 decimal
    const decimals = lakhs < 10 ? 2 : 1;
    return `${sign}₹${lakhs.toFixed(decimals)}L`;
  }
  
  // 1 Thousand = 1,000
  if (absAmount >= 1000) {
    const thousands = absAmount / 1000;
    // Show 1 decimal for thousands
    const decimals = thousands < 10 ? 1 : 0;
    return `${sign}₹${thousands.toFixed(decimals)}K`;
  }
  
  // Less than 1000, show whole number
  return `${sign}₹${Math.round(absAmount)}`;
}
