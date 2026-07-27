import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../Sidebar";
import Spinner from "../../utils/Spinner";
import decodeToken from "../../utils/tokenDecored";
import HttpClient from "../../Services/httpService";
import { formatCopCurrency } from "../../utils/PricesFormat";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SavingsIcon from "@mui/icons-material/Savings";

interface ConfigTope {
  TopeMaximoVenta: number;
  Activo: boolean;
  FechaActualizacion?: string;
}

export default function ConfigTopesVentas() {
  const [config, setConfig] = useState<ConfigTope>({
    TopeMaximoVenta: 0,
    Activo: true,
  });
  const [topeInput, setTopeInput] = useState("");
  const [activo, setActivo] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const esAdmin = decodeToken()?.user?.role === "Administrador";

  const cargarConfig = async () => {
    setIsLoading(true);
    try {
      const res = await HttpClient.get(
        `${import.meta.env.VITE_API_URL}/api/ventas/topes/config`
      );
      const data = res.data;
      setConfig(data);
      setTopeInput(String(data?.TopeMaximoVenta ?? 0));
      setActivo(!!data?.Activo);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo cargar la configuración de topes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const tope = Number(topeInput.replace(/\D/g, ""));

    if (Number.isNaN(tope) || tope < 0) {
      toast.error("Ingrese un tope válido");
      return;
    }

    setIsSaving(true);
    try {
      const res = await HttpClient.put(
        `${import.meta.env.VITE_API_URL}/api/ventas/topes/config`,
        { TopeMaximoVenta: tope, Activo: activo }
      );
      setConfig(res.data);
      toast.success("Tope de ventas actualizado");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el tope");
    } finally {
      setIsSaving(false);
    }
  };

  if (!esAdmin) {
    return (
      <section>
        <Sidebar />
        <div className="ml-[64px] p-8 text-center">
          <p className="text-xl text-red-600 font-semibold">
            Solo administradores pueden configurar topes de ventas.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <Sidebar />
      <div className="ml-[64px] min-h-screen bg-[#F2F2FF]">
        <header className="flex items-center gap-4 border-b shadow-md bg-white px-4 py-4">
          <Link to="/ventas" className="text-primary">
            <ArrowBackIcon fontSize="large" />
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold text-primary flex items-center gap-2">
            <SavingsIcon fontSize="large" />
            Topes de ventas
          </h1>
        </header>

        <div className="max-w-xl mx-auto p-6">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner isLoading={isLoading} />
            </div>
          ) : (
            <form
              onSubmit={handleSave}
              className="bg-white rounded-lg shadow-md p-6 space-y-6"
            >
              <p className="text-gray-600 text-sm md:text-base">
                Define el valor máximo que un vendedor puede registrar sin
                superar el tope. Si la venta{" "}
                <strong>excede este monto</strong>, quedará en{" "}
                <strong>Ventas por aprobar</strong> con una alerta para la
                administradora.
              </p>

              <div>
                <label className="block font-semibold text-secondary mb-2">
                  Tope máximo de venta (COP)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-lg"
                  value={topeInput}
                  onChange={(e) =>
                    setTopeInput(e.target.value.replace(/[^\d]/g, ""))
                  }
                  placeholder="Ej: 2000000"
                />
                {topeInput && (
                  <p className="text-sm text-gray-500 mt-1">
                    Vista previa: {formatCopCurrency(Number(topeInput))}
                  </p>
                )}
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                  className="w-5 h-5 accent-primary"
                />
                <span className="font-medium text-gray-700">
                  Validación de tope activa
                </span>
              </label>

              {config.FechaActualizacion && (
                <p className="text-xs text-gray-400">
                  Última actualización:{" "}
                  {new Date(config.FechaActualizacion).toLocaleString("es-CO")}
                </p>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-tertiary disabled:opacity-60"
              >
                {isSaving ? "Guardando..." : "Guardar configuración"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
