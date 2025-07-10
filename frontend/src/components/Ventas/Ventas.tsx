import Sidebar from "../Sidebar";
import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Spinner from "../../utils/Spinner";

import decodeToken from "../../utils/tokenDecored";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TuneIcon from "@mui/icons-material/Tune";
import { useVendedorContext } from "../../utils/Context/VendedorSelectedContext";
import VisualizarVentaModal from "../../utils/Ventas/VisualizarVentaModal";
import FilterPdfModal from "../../utils/PdfFilterModal/FilterPdfModal";
import CrearVentaModal from "../../utils/Ventas/CrearVentaModal";
import HttpClient from "../../Services/httpService";
import VentasFilter from "./VentasFilter";

function Ventas() {
  interface Venta {
    Id: number;
    FechaInicio: string;
    FechaFin: string;
    NumeroCuotas: number;
    NumeroVenta: string;
    SaldoMoraTotal: number;
    DetallesVenta: string;
    ValorVenta: number;
    NombreVendedor: string;
    NombreCliente: string;
    PeriodicidadNombre: string;
    CuotasPagadas: number;
    ValorAbonado: number;
    ValorSeguro: number;
    TasaInteres: number;
    Liquidada: boolean;
    Estado: string;
    ColorEstado: string;
    ColorTexto: string;
    FechaServer: string;
    TelefonoCliente: string;
    Archivada: boolean;
    FotoCliente: string;
  }

  const { VendedorSelectedContext } = useVendedorContext();

  const [ventas, setVentas] = useState<Venta[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ventaSelected, setVentaSelected] = useState<Venta | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  const [inputValue, setInputValue] = useState<string>("");

  const { id } = useParams<{ id: string }>();

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const [currentPage, setCurrentPage] = useState(0);

  const [pageCount, setPageCount] = useState(1);

  const handlePageClick = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  const Id = decodeToken()?.user.Id;

  const [filtro, setFiltro] = useState<number>(0);

  const getVentas = async () => {
    setIsLoading(true);
    try {
      let res;
      // si la solicitud viene con un id, se obtiene la venta por id
      if (id) {
        res = await HttpClient.get(
          `${import.meta.env.VITE_API_URL}/api/ventas/${id}`
        );
        // si el rol del usuario es vendedor, se obtienen las ventas del vendedor
      } else if (decodeToken()?.user.role !== "Administrador") {
        res = await HttpClient.get(
          `${import.meta.env.VITE_API_URL}/api/ventas/vendedor/${Id}`,
          {
            params: {
              page: currentPage + 1,
              limit: 16,
            },
          }
        );
      } else if (
        decodeToken()?.user.role === "Administrador" &&
        VendedorSelectedContext
      ) {
        res = await HttpClient.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/ventas/vendedor/${VendedorSelectedContext}`,
          {
            params: {
              page: currentPage + 1,
              limit: 16,
            },
          }
        );
      } else {
        res = await HttpClient.get(
          `${import.meta.env.VITE_API_URL}/api/ventas/${Id}/all`,
          {
            params: {
              page: currentPage + 1,
              limit: 16,
            },
          }
        );
      }

      let data;
      if (decodeToken()?.user.role === "Administrador" && id) {
        data = res.data;
      } else {
        data = res.data.data;
      }
      setVentas(data);
      setPageCount(res.data.totalPages);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const [visibleRange, setVisibleRange] = useState([0, 5]);

  const handleNextRange = () => {
    setVisibleRange([visibleRange[0] + 5, visibleRange[1] + 5]);
  };

  const handlePrevRange = () => {
    setVisibleRange([visibleRange[0] - 5, visibleRange[1] - 5]);
  };

  const visiblePages = Array.from(
    { length: pageCount },
    (_, index) => index
  ).slice(visibleRange[0], visibleRange[1]);

  const handleFilterChange = (value: number) => {
    setFiltro(value);
  };

  const getVentasFilter = async () => {
    setIsLoading(true);
    try {
      let res;
      if (
        decodeToken()?.user.role === "Administrador" &&
        VendedorSelectedContext
      ) {
        res = await HttpClient.get(
          `${import.meta.env.VITE_API_URL}/api/ventas/filter`,
          {
            params: {
              page: currentPage + 1,
              limit: 16,
              TipoFiltro: filtro,
              VendedorId: VendedorSelectedContext,
            },
          }
        );
      } else if (
        decodeToken()?.user.role === "Administrador" &&
        !VendedorSelectedContext
      ) {
        res = await HttpClient.get(
          `${import.meta.env.VITE_API_URL}/api/ventas/filter`,
          {
            params: {
              page: currentPage + 1,
              limit: 16,
              TipoFiltro: filtro,
              AdministradorId: Id,
            },
          }
        );
      } else {
        res = await HttpClient.get(
          `${import.meta.env.VITE_API_URL}/api/ventas/filter`,
          {
            params: {
              page: currentPage + 1,
              limit: 16,
              TipoFiltro: filtro,
              VendedorId: Id,
            },
          }
        );
      }

      setVentas(res.data.data);
      setPageCount(res.data.totalPages);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getVentasFilterBuscar = async (Buscar: string) => {
    setIsLoading(true);
    try {
      let res;
      if (decodeToken()?.user.role === "Administrador") {
        res = await HttpClient.get(
          `${import.meta.env.VITE_API_URL}/api/ventas/filter`,
          {
            params: {
              page: currentPage + 1,
              limit: 16,
              Buscar: Buscar,
              AdministradorId: Id,
            },
          }
        );
      } else {
        res = await HttpClient.get(
          `${import.meta.env.VITE_API_URL}/api/ventas/filter`,
          {
            params: {
              page: currentPage + 1,
              limit: 16,
              TipoFiltro: filtro,
              Buscar: Buscar,
              VendedorId: Id,
            },
          }
        );
      }

      setVentas(res.data.data);
      setPageCount(res.data.totalPages);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (filtro === 0) {
      getVentas();
    } else if (filtro !== 0) {
      getVentasFilter();
    }
  }, [currentPage, inputValue === ""]);

  useEffect(() => {
    setCurrentPage(0);
    if (filtro !== 0) {
      getVentasFilter();
    }
  }, [filtro]);

  const handleSearch = (e: any) => {
    e.preventDefault();
    const value = e.target.value;
    setInputValue(value);
  };

  useEffect(() => {
    setCurrentPage(0);
    if (inputValue !== "") {
      const handler = setTimeout(() => {
        setCurrentPage(0);
        getVentasFilterBuscar(inputValue);
      }, 400);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [inputValue]);

  return (
    <section>
      <Sidebar />
      <div className="ml-[64px]">
        <header className="flex flex-col items-center w-full border-b shadow-md bg-white">
          <div className="flex-1 flex justify-cente">
            <h1 className="text-2xl text-primary md:text-4xl lg:text-6xl text-center p-2 font-bold">
              {decodeToken()?.user.role === "Administrador"
                ? "Ventas"
                : "Tus Ventas"}
            </h1>
          </div>
          <div className="flex-1 flex justify-end space-x-4">
            <button className="text-primary">
              <PictureAsPdfIcon
                fontSize="large"
                onClick={() => setIsPdfFilterOpen(true)}
              />
            </button>
            <button className="text-primary">
              <AddCircleIcon fontSize="large" onClick={toggleModal} />
            </button>
            <button className="text-primary">
              <TuneIcon
                fontSize="large"
                onClick={() => setIsFilterOpen(true)}
              />
            </button>
          </div>
          <form
            className="mx-auto w-full md:w-1/2 mb-2"
            onSubmit={handleSearch}
          >
            <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
              Buscar
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-3 ps-10 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-fifth focus:border-fifth"
                placeholder="Buscar cliente"
                onChange={handleSearch}
                required
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-sixth font-medium rounded-lg text-sm px-4 py-2"
              >
                Buscar
              </button>
            </div>
          </form>
        </header>
        <section
          className={`flex items-center justify-center ${
            isLoading && "h-[100vh]"
          }`}
        >
          {isLoading ? (
            <Spinner isLoading={isLoading} />
          ) : (
            <div className="w-full">
              <section className="w-full px-2">
                <CrearVentaModal
                  isOpen={isModalOpen}
                  onClose={toggleModal}
                  getVentas={getVentas}
                />
                <VentasFilter
                  isOpen={isFilterOpen}
                  onClose={() => {
                    setIsFilterOpen(false);
                  }}
                  onChange={handleFilterChange}
                  vendedorId={
                    decodeToken()?.user.role !== "Administrador"
                      ? Id
                      : undefined
                  }
                  administradorId={
                    decodeToken()?.user.role === "Administrador"
                      ? Id
                      : undefined
                  }
                />
                <VisualizarVentaModal
                  isOpen={isDetailsOpen}
                  onClose={() => setIsDetailsOpen(false)}
                  ventaSelected={ventaSelected}
                />
                <FilterPdfModal
                  isOpen={isPdfFilterOpen}
                  onClose={() => setIsPdfFilterOpen(false)}
                />
             
              </section>
              <ul className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
                {ventas &&
                  ventas.length > 0 &&
                  ventas.map((venta) => (
                    <li
                      onClick={() => {
                        setVentaSelected(venta);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <div className="flex flex-col m-2 p-2">
                        <header className="bg-primary text-white font-normal py-4 rounded-md px-4 w-full flex flex-col items-center min-h-[120px]">
                          <img src={venta.FotoCliente} alt="foto cliente" className="w-16 h-16 rounded-full mb-2"/>
                          <h1 className="text-xl pb-2 text-center">
                            <span className="font-bold">Venta:</span>{" "}
                            {venta.NumeroVenta}
                          </h1>
                          <p className="text-gray-300 text-lg mx-3 text-center min-h-[60px]">
                            <span className="font-semibold text-white">Cliente:</span>{" "}
                            {venta.NombreCliente}
                          </p>
                          <p className="text-gray-300 text-lg mx-3 text-center">
                            <span className="font-semibold text-white">Valor Venta:</span>{" "}
                            {venta.ValorVenta.toLocaleString("es-CO", {
                              style: "currency",
                              currency: "COP",
                            })}
                          </p>
                          <span
                            className={`rounded-md p-1 text-sm bg-[${venta.ColorEstado}] mt-2`}
                            style={{
                              backgroundColor: `${venta.ColorEstado}`,
                              color: `${venta.ColorTexto}`,
                            }}
                          >
                            {venta.Estado}
                          </span>
                       
                        </header>
                      </div>
                    </li>
                  ))}
              </ul>
              <div className="flex justify-center mt-4">
                {visibleRange[0] > 0 && (
                  <button
                    className="mx-1 px-3 py-1 border rounded bg-white text-tertiary"
                    onClick={handlePrevRange}
                  >
                    Anterior
                  </button>
                )}
                {visiblePages.map((index) => (
                  <button
                    key={index}
                    className={`mx-1 px-3 py-1 border rounded ${
                      currentPage === index
                        ? "bg-tertiary text-white"
                        : "bg-white text-tertiary"
                    }`}
                    onClick={() => handlePageClick(index)}
                  >
                    {index + 1}
                  </button>
                ))}
                {visibleRange[1] < pageCount && (
                  <button
                    className="mx-1 px-3 py-1 border rounded bg-white text-tertiary"
                    onClick={handleNextRange}
                  >
                    Siguiente
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default Ventas;
