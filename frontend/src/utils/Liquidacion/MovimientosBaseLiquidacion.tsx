import { formatCopCurrency } from "../PricesFormat";

export interface MovimientoBase {
  Id: number;
  Tipo: "Abono" | "Retiro";
  Valor: number;
  Descripcion: string;
  LiquidacionConse?: string;
}

interface Props {
  movimientos: MovimientoBase[];
  compact?: boolean;
}

export default function MovimientosBaseLiquidacion({
  movimientos,
  compact = false,
}: Props) {
  if (!movimientos.length) {
    return null;
  }

  const neto = movimientos.reduce(
    (acc, m) => acc + (m.Tipo === "Abono" ? Number(m.Valor) : -Number(m.Valor)),
    0
  );

  return (
    <section
      className={`w-full rounded-md border border-gray-200 bg-gray-50 ${
        compact ? "p-2 my-2" : "p-3 my-3"
      }`}
    >
      <h4 className="text-base font-semibold text-secondary mb-2">
        Ajustes de base (Abonos y Retiros)
      </h4>
      <ul className="space-y-2">
        {movimientos.map((mov) => (
          <li
            key={`${mov.Tipo}-${mov.Id}`}
            className="flex items-start justify-between gap-2 text-sm border-b border-gray-200 pb-2 last:border-0 last:pb-0"
          >
            <div className="flex-1">
              <span
                className={`font-semibold ${
                  mov.Tipo === "Abono" ? "text-green-700" : "text-red-700"
                }`}
              >
                {mov.Tipo === "Abono" ? "(+) Abono" : "(−) Retiro"}
              </span>
              {mov.Descripcion && (
                <p className="text-gray-600 mt-0.5">{mov.Descripcion}</p>
              )}
            </div>
            <span
              className={`font-semibold whitespace-nowrap ${
                mov.Tipo === "Abono" ? "text-green-700" : "text-red-700"
              }`}
            >
              {mov.Tipo === "Abono" ? "+" : "−"}
              {formatCopCurrency(mov.Valor)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-2 pt-2 border-t border-gray-300 flex justify-between text-sm font-semibold">
        <span>Neto ajustes base:</span>
        <span className={neto >= 0 ? "text-green-700" : "text-red-700"}>
          {neto >= 0 ? "+" : "−"}
          {formatCopCurrency(Math.abs(neto))}
        </span>
      </div>
    </section>
  );
}
