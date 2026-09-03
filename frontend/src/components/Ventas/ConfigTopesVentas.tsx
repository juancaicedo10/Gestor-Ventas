import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../Sidebar";
import Spinner from "../../utils/Spinner";
import decodeToken from "../../utils/tokenDecored";
import HttpClient from "../../Services/httpService";
import { formatCopCurrency } from "../../utils/PricesFormat";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SavingsIcon from "@mui/icons-material/Savings";

interface ClienteTope {
  Id: number;
  NombreCompleto: string;
  NumeroDocumento: string;
  TopeMaximoVenta?: number | null;
}

export default function ConfigTopesVentas() {
  const [clientes, setClientes] = useState<ClienteTope[]>([]);
  const [search, setSearch] = useState("");
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const adminId = decodeToken()?.user?.Id;
  const esAdmin = decodeToken()?.user?.role === "Administrador";

  const cargarClientes = async () => {
    setIsLoading(true);
    try {
      const res = await HttpClient.get(
        `${import.meta.env.VITE_API_URL}/api/clientes/${adminId}/all`,
        { params: { page: 1, limit: 500, search: "" } }
      );
      const data: ClienteTope[] = res.data?.data || [];
      setClientes(data);
      const nextDrafts: Record<number, string> = {};
      data.forEach((c) => {
        nextDrafts[c.Id] = String(Number(c.TopeMaximoVenta ?? 0) || "");
      });
      setDrafts(nextDrafts);
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron cargar los clientes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (esAdmin && adminId) {
      cargarClientes();
    }
  }, [esAdmin, adminId]);

  const filtrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter(
      (c) =>
        c.NombreCompleto?.toLowerCase().includes(q) ||
        c.NumeroDocumento?.toLowerCase().includes(q)
    );
  }, [clientes, search]);

  const guardarTope = async (cliente: ClienteTope) => {
    const raw = drafts[cliente.Id] ?? "";
    const tope = raw === "" ? 0 : Number(raw.replace(/\D/g, ""));

    if (Number.isNaN(tope) || tope < 0) {
      toast.error("Ingrese un tope válido");
      return;
    }

    setSavingId(cliente.Id);
    try {
      const res = await HttpClient.put(
        `${import.meta.env.VITE_API_URL}/api/ventas/topes/cliente/${cliente.Id}`,
        { TopeMaximoVenta: tope }
      );
      setClientes((prev) =>
        prev.map((c) =>
          c.Id === cliente.Id
            ? { ...c, TopeMaximoVenta: res.data?.TopeMaximoVenta ?? tope }
            : c
        )
      );
      toast.success(`Tope actualizado para ${cliente.NombreCompleto}`);
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el tope del cliente");
    } finally {
      setSavingId(null);
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
            Topes por cliente
          </h1>
        </header>

        <div className="max-w-4xl mx-auto p-6 space-y-4">
          <p className="text-gray-600 text-sm md:text-base bg-white rounded-lg shadow-sm p-4">
            Cada cliente tiene su propio tope máximo de venta. Si el vendedor
            registra un valor mayor al tope de ese cliente, la venta queda en{" "}
            <strong>Ventas por aprobar</strong> con alerta. Deja el tope en{" "}
            <strong>0</strong> (o vacío) para no validar a ese cliente.
          </p>

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cliente por nombre o documento"
            className="w-full border-2 border-gray-300 rounded-md px-3 py-2 bg-white"
          />

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner isLoading={isLoading} />
            </div>
          ) : (
            <ul className="space-y-3">
              {filtrados.map((cliente) => (
                <li
                  key={cliente.Id}
                  className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row md:items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {cliente.NombreCompleto}
                    </p>
                    <p className="text-sm text-gray-500">
                      CC. {cliente.NumeroDocumento}
                    </p>
                    {Number(cliente.TopeMaximoVenta) > 0 && (
                      <p className="text-xs text-primary mt-1">
                        Actual: {formatCopCurrency(Number(cliente.TopeMaximoVenta))}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      className="w-40 border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Sin tope"
                      value={drafts[cliente.Id] ?? ""}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [cliente.Id]: e.target.value.replace(/[^\d]/g, ""),
                        }))
                      }
                    />
                    <button
                      type="button"
                      disabled={savingId === cliente.Id}
                      onClick={() => guardarTope(cliente)}
                      className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-tertiary disabled:opacity-60"
                    >
                      {savingId === cliente.Id ? "..." : "Guardar"}
                    </button>
                  </div>
                </li>
              ))}
              {filtrados.length === 0 && (
                <li className="text-center text-gray-500 py-8">
                  No hay clientes para mostrar
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
