const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatCopCurrency = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0);

export const formatInputValue = (inputValue: string) => {
  const numericString = inputValue.replace(/\D/g, '');
  const numericValue = Number(numericString);
  return copFormatter.format(numericValue);
};