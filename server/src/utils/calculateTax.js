export const calculateTax = (subtotal, taxRate = 18) => {
  const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxRate,
    taxAmount,
    total: Math.round((subtotal + taxAmount) * 100) / 100,
  };
};
