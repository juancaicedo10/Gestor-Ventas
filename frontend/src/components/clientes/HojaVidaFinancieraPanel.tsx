import { ReactNode } from "react";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export interface HojaVidaFinanciera {
  totalVentas: number;
  ventasPagadas: number;
  ventasEnMora: number;
  ventasActivas: number;
  ventasEnMoraActivas: number;
  calificacionComportamiento: number | null;
  nivelRiesgo: string;
  sinHistorial: boolean;
}

interface HojaVidaFinancieraPanelProps {
  data: HojaVidaFinanciera | null;
  isLoading: boolean;
  nombreCliente?: string;
}

const NIVEL_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; bar: string }
> = {
  EXCELENTE: {
    label: "Excelente pagador",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    bar: "bg-green-500",
  },
  ACEPTABLE: {
    label: "Comportamiento aceptable",
    color: "text-yellow-700",
    bg: "bg-yellow-50 border-yellow-200",
    bar: "bg-yellow-500",
  },
  MODERADO: {
    label: "Riesgo moderado",
    color: "text-orange-700",
    bg: "bg-orange-50 border-orange-200",
    bar: "bg-orange-500",
  },
  ALTO_RIESGO: {
    label: "Alto riesgo",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    bar: "bg-red-500",
  },
  SIN_HISTORIAL: {
    label: "Sin historial crediticio",
    color: "text-gray-600",
    bg: "bg-gray-50 border-gray-200",
    bar: "bg-gray-400",
  },
};

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: number | string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full ${accent}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

export default function HojaVidaFinancieraPanel({
  data,
  isLoading,
  nombreCliente,
}: HojaVidaFinancieraPanelProps) {
  if (isLoading) {
    return (
      <div className="mx-4 my-4 ml-[81px] animate-pulse rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 h-6 w-64 rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-24 rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const config = NIVEL_CONFIG[data.nivelRiesgo] || NIVEL_CONFIG.SIN_HISTORIAL;
  const calificacion = data.sinHistorial
    ? null
    : Math.round(data.calificacionComportamiento ?? 0);

  return (
    <section className="mx-4 my-4 ml-[81px] rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <AssessmentIcon />
        </div>
        <div>
          <h2 className="text-lg font-bold text-primary md:text-xl">
            Hoja de Vida Financiera
          </h2>
          <p className="text-sm text-gray-500">
            Resumen crediticio de {nombreCliente || "el cliente"}
          </p>
        </div>
      </div>

      {data.sinHistorial ? (
        <div className={`rounded-xl border p-4 ${config.bg}`}>
          <p className={`font-semibold ${config.color}`}>{config.label}</p>
          <p className="mt-1 text-sm text-gray-600">
            Este cliente no tiene ventas aprobadas previas. Evalua con cuidado
            antes de aprobar un nuevo credito.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<ShoppingBagOutlinedIcon fontSize="small" className="text-gray-600" />}
              label="Total de ventas"
              value={data.totalVentas}
              accent="bg-gray-100"
            />
            <StatCard
              icon={<CheckCircleOutlineIcon fontSize="small" className="text-green-600" />}
              label="Ventas pagadas"
              value={data.ventasPagadas}
              accent="bg-green-100"
            />
            <StatCard
              icon={<WarningAmberIcon fontSize="small" className="text-red-600" />}
              label="Ventas en mora"
              value={data.ventasEnMora}
              accent="bg-red-100"
            />
            <div className={`rounded-xl border p-4 ${config.bg}`}>
              <div className="mb-2 flex items-center gap-2">
                <ErrorOutlineIcon fontSize="small" className={config.color} />
                <span className={`text-sm font-semibold ${config.color}`}>
                  Calificacion
                </span>
              </div>
              <p className={`text-3xl font-bold ${config.color}`}>{calificacion}%</p>
              <p className={`text-sm font-medium ${config.color}`}>{config.label}</p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/80">
                <div
                  className={`h-full rounded-full transition-all ${config.bar}`}
                  style={{ width: `${calificacion}%` }}
                />
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            {data.ventasActivas} venta(s) activa(s)
            {data.ventasEnMoraActivas > 0
              ? ` · ${data.ventasEnMoraActivas} con mora activa`
              : " · sin mora activa actualmente"}
            .
          </p>
        </>
      )}
    </section>
  );
}
