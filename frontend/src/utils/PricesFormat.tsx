const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatInputValue = (inputValue: string) => {
  const numericString = inputValue.replace(/\D/g, '');
  const numericValue = Number(numericString);
  return copFormatter.format(numericValue);
};