const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Formato COP con 2 decimales, consistente en todos los navegadores (sin depender de CLDR para COP). */
export const formatCopCurrency = (value: number | string | null | undefined) => {
  const amount = Number(value ?? 0);
  if (Number.isNaN(amount)) return '$ 0,00';

  const negative = amount < 0;
  const [intPart, decPart] = Math.abs(amount).toFixed(2).split('.');
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${negative ? '- ' : ''}$ ${withThousands},${decPart}`;
};

export const formatInputValue = (inputValue: string) => {
  const numericString = inputValue.replace(/\D/g, '');
  const numericValue = Number(numericString);
  return copFormatter.format(numericValue);
};
