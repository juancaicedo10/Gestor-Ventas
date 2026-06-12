const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Formato COP con 2 decimales (es-CO: miles con punto, decimales con coma). */
export const formatCopCurrency = (value: number | string | null | undefined) => {
  const amount = Number(value ?? 0);
  if (Number.isNaN(amount)) return "$ 0,00";

  const formatted = new Intl.NumberFormat("es-CO", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `$ ${formatted}`;
};

export const formatInputValue = (inputValue: string) => {
  const numericString = inputValue.replace(/\D/g, '');
  const numericValue = Number(numericString);
  return copFormatter.format(numericValue);
};