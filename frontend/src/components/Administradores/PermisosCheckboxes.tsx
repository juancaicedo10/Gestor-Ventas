import { useEffect, useMemo, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import SecurityIcon from "@mui/icons-material/Security";
import HttpClient from "../../Services/httpService";

interface PermisosCheckboxesProps {
  selectedPermisos: string[];
  onChange: (permisos: string[]) => void;
}

interface Modulo {
  Id: number;
  Codigo: string;
  Nombre: string;
}

const GRUPOS: { titulo: string; codigos: string[] }[] = [
  {
    titulo: "Operacion",
    codigos: ["VENDEDORES", "CLIENTES", "VENTAS", "GASTOS"],
  },
  {
    titulo: "Finanzas",
    codigos: ["ABONOS_RETIROS", "LIQUIDACIONES"],
  },
  {
    titulo: "Aprobaciones",
    codigos: ["CLIENTES_APROBAR", "GASTOS_APROBAR", "VENTAS_APROBAR"],
  },
  {
    titulo: "Administracion",
    codigos: ["ADMINISTRADORES", "DISPOSITIVOS"],
  },
];

export default function PermisosCheckboxes({
  selectedPermisos,
  onChange,
}: PermisosCheckboxesProps) {
  const [modulos, setModulos] = useState<Modulo[]>([]);

  useEffect(() => {
    HttpClient.get(`${import.meta.env.VITE_API_URL}/api/administradores/modulos`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => setModulos(response.data))
      .catch((error) => console.error("Error cargando modulos:", error));
  }, []);

  const modulosPorCodigo = useMemo(() => {
    return modulos.reduce<Record<string, Modulo>>((acc, modulo) => {
      acc[modulo.Codigo] = modulo;
      return acc;
    }, {});
  }, [modulos]);

  const togglePermiso = (codigo: string) => {
    if (selectedPermisos.includes(codigo)) {
      onChange(selectedPermisos.filter((permiso) => permiso !== codigo));
      return;
    }

    onChange([...selectedPermisos, codigo]);
  };

  const seleccionarTodos = () => {
    onChange(modulos.map((modulo) => modulo.Codigo));
  };

  const quitarTodos = () => {
    onChange([]);
  };

  return (
    <section className="mt-6 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <SecurityIcon fontSize="small" />
          </div>
          <div>
            <h6 className="text-base font-semibold text-gray-800">
              Permisos de modulos
            </h6>
            <p className="text-xs text-gray-500 sm:text-sm">
              Selecciona las secciones que este administrador podra ver y usar.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold leading-none text-primary">
            {selectedPermisos.length} de {modulos.length}
          </span>
          <button
            type="button"
            onClick={seleccionarTodos}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-primary/30 hover:text-primary"
          >
            Todos
          </button>
          <button
            type="button"
            onClick={quitarTodos}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-red-200 hover:text-red-600"
          >
            Ninguno
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {GRUPOS.map((grupo) => {
          const modulosGrupo = grupo.codigos
            .map((codigo) => modulosPorCodigo[codigo])
            .filter(Boolean);

          if (modulosGrupo.length === 0) return null;

          return (
            <div key={grupo.titulo}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                {grupo.titulo}
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {modulosGrupo.map((modulo) => {
                  const selected = selectedPermisos.includes(modulo.Codigo);

                  return (
                    <button
                      key={modulo.Codigo}
                      type="button"
                      onClick={() => togglePermiso(modulo.Codigo)}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all ${
                        selected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                          selected
                            ? "border-primary bg-primary text-white"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {selected && <CheckIcon sx={{ fontSize: 14 }} />}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {modulo.Nombre}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
