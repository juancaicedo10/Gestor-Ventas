import { FormEvent, ReactNode, useEffect, useState } from "react";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import NotesIcon from "@mui/icons-material/Notes";
import { toast } from "react-toastify";
import HttpClient from "../../Services/httpService";
import decodeToken from "../../utils/tokenDecored";

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
  clienteId?: number;
}

interface NotaHojaVida {
  id: number;
  texto: string;
  nombreAutor: string;
  fechaCreacion: string;
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

const formatFechaNota = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function HojaVidaFinancieraPanel({
  data,
  isLoading,
  nombreCliente,
  clienteId,
}: HojaVidaFinancieraPanelProps) {
  const [notas, setNotas] = useState<NotaHojaVida[]>([]);
  const [nuevaNota, setNuevaNota] = useState("");
  const [isSavingNota, setIsSavingNota] = useState(false);
  const isAdmin = decodeToken()?.user?.role === "Administrador";

  useEffect(() => {
    if (!clienteId) {
      setNotas([]);
      return;
    }

    HttpClient.get(
      `${import.meta.env.VITE_API_URL}/api/clientes/${clienteId}/hoja-vida-financiera/notas`
    )
      .then((res) => setNotas(res.data || []))
      .catch(() => setNotas([]));
  }, [clienteId]);

  const handleRegistrarNota = async (event: FormEvent) => {
    event.preventDefault();
    if (!clienteId || !nuevaNota.trim()) {
      toast.warn("Escribe una nota antes de guardar");
      return;
    }

    try {
      setIsSavingNota(true);
      const res = await HttpClient.post(
        `${import.meta.env.VITE_API_URL}/api/clientes/${clienteId}/hoja-vida-financiera/notas`,
        { texto: nuevaNota.trim() }
      );
      setNotas((prev) => [res.data, ...prev]);
      setNuevaNota("");
      toast.success("Nota registrada");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "No se pudo guardar la nota");
    } finally {
      setIsSavingNota(false);
    }
  };

  const handleDesactivarNota = async (notaId: number) => {
    if (!clienteId) return;

    try {
      await HttpClient.delete(
        `${import.meta.env.VITE_API_URL}/api/clientes/${clienteId}/hoja-vida-financiera/notas/${notaId}`
      );
      setNotas((prev) => prev.filter((nota) => nota.id !== notaId));
      toast.success("Nota eliminada");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "No se pudo eliminar la nota");
    }
  };
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

      {typeof calificacion === "number" && calificacion >= 80 && notas.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          La calificación automática está alta, pero hay notas manuales.
          Revisa el historial antes de otorgar un nuevo crédito: un cliente
          pudo haber estado en cartera castigada y pagar meses después.
        </div>
      )}

      <div className="mt-5 border-t border-gray-100 pt-4">
        <div className="mb-3 flex items-center gap-2">
          <NotesIcon className="text-primary" />
          <h3 className="text-base font-bold text-primary">Notas del administrador</h3>
        </div>
        <p className="mb-3 text-sm text-gray-500">
          Estas notas no se borran cuando el cliente pone al día una deuda
          vieja. Sirven para dejar constancia de cartera castigada o mala paga.
        </p>

        {isAdmin && clienteId && (
          <form onSubmit={handleRegistrarNota} className="mb-4">
            <textarea
              value={nuevaNota}
              onChange={(e) => setNuevaNota(e.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="Ej: Estuvo en cartera castigada 8 meses y pagó después de muchas gestiones."
              className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-800 focus:border-fifth focus:ring-fifth"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-400">{nuevaNota.length}/1000</span>
              <button
                type="submit"
                disabled={isSavingNota || !nuevaNota.trim()}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-tertiary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingNota ? "Guardando..." : "Agregar nota"}
              </button>
            </div>
          </form>
        )}

        {notas.length === 0 ? (
          <p className="text-sm text-gray-500">Aún no hay notas en esta hoja de vida.</p>
        ) : (
          <ul className="max-h-72 space-y-2 overflow-y-auto">
            {notas.map((nota) => (
              <li key={nota.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="whitespace-pre-wrap text-sm text-gray-800">{nota.texto}</p>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDesactivarNota(nota.id)}
                      className="shrink-0 text-xs text-red-600 hover:text-red-800"
                    >
                      Quitar
                    </button>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {nota.nombreAutor} · {formatFechaNota(nota.fechaCreacion)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
