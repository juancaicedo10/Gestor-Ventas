import AddCircleIcon from "@mui/icons-material/AddCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import SellIcon from "@mui/icons-material/Sell";
import { useEffect, useState } from "react";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Select from "react-select";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useVendedorContext } from "../../utils/Context/VendedorSelectedContext";
import HttpClient from "../../Services/httpService";
import decodeToken from "../../utils/tokenDecored";
import Sidebar from "../Sidebar";
import NuevoTipoGastoModal from "../../utils/Gastos/NuevoTipoGastoModal";
import ModalDeleteTipoGasto from "../../utils/Gastos/ModalEliminarTipoGasto";
import ModificarTipoGastoModal from "../../utils/Gastos/ModificarTipoGastoModal";
import NuevoGastoModal from "../../utils/Gastos/NuevoGastoModal";
import ModificarGastoModal from "../../utils/Gastos/ModificarGastoModal";
import ModalDeleteGasto from "../../utils/Gastos/ModalEliminarGasto.tsx";
import Spinner from "../../utils/Spinner.tsx";
import { formatDate } from "../../utils/Helpers/FormatDate.tsx";

interface Gasto {
  GastoId: number;
  Nombre: string;
  Descripcion: string;
  MontoMaximo: number;
}

interface GastoPorVendedor {
  Id: number;
  GastoId: number;
  Nombre: string;
  Descripcion: string;
  Monto: number;
  Fecha: string;
  NombreVendedor: string;
  Liquidado: boolean;
}

interface Vendedor {
  Id: number;
  NombreCompleto: string;
}

function Gastos() {
  const [activeView, setActiveView] = useState<
    "tiposDeGastos" | "gastosPorVendedor"
  >("tiposDeGastos");

  const { VendedorSelectedContext } = useVendedorContext();

  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [gastosPorVendedor, setGastosPorVendedor] = useState<
    GastoPorVendedor[]
  >([]);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const [openDropdownTipoId, setOpenDropdownTipoId] = useState<number | null>(
    null
  );

  const [selectedSeller, setSelectedSeller] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [searched, setSearched] = useState<boolean>(false);

  console.log(searched);

  const [Id, setId] = useState<number>(0);

  const [TipoGastoId, setTipoGastoId] = useState<number>(0);

  //modales del edit de gastos

  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);

  const [isOpenDeleteTipoGastoModal, setIsOpenDeleteTipoGastoModal] =
    useState<boolean>(false);

  const [isOpenDeleteGastoModal, setIsOpenDeleteGastoModal] =
    useState<boolean>(false);

  const toggleEditModal = (id: number) => {
    setIsOpenEditModal(!isOpenEditModal);
    setId(id);
  };

  console.log(toggleEditModal);

  //modales del creado del gasto

  const [isOpenTIpoGastoModal, setIsOpenTipoGastoModal] =
    useState<boolean>(false);

  //modales del editado del gasto

  const [isOpenEditGastoModal, setIsOpenEditGastoModal] =
    useState<boolean>(false);

  const toggleTipoGastoEditModal = (GastoId: number) => {
    setIsOpenEditGastoModal(!isOpenEditGastoModal);
    setTipoGastoId(GastoId);
  };

  const getTiposGastos = async () => {
    setIsLoading(true);
    HttpClient.get(`${import.meta.env.VITE_API_URL}/api/gastos/tipos`)
      .then((res) => {
        setGastos(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const getGastos = async () => {
    setIsLoading(true);
    HttpClient.get(
      `${import.meta.env.VITE_API_URL}/api/gastos/${
        decodeToken()?.user?.Id
      }/all`
    )
      .then((res) => {
        setGastosPorVendedor(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const getVendedores = async () => {
    setIsLoading(true);
    let Url =
      decodeToken()?.user.role !== "Administrador"
        ? `${import.meta.env.VITE_API_URL}/api/vendedores/${
            decodeToken()?.user?.Id
          }`
        : `${import.meta.env.VITE_API_URL}/api/vendedores/${
            decodeToken()?.user?.Id
          }/all`;
    await HttpClient.get(`${Url}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setVendedores(response.data);
        } else {
          setVendedores([response.data]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const getGastosByVendedor = async () => {
    setIsLoading(true);
    HttpClient.get(
      `${import.meta.env.VITE_API_URL}/api/gastos/vendedor/${selectedSeller}`
    )
      .then((res) => {
        setGastosPorVendedor(res.data);
        setIsLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getTiposGastos();
    getVendedores();
  }, []);

  useEffect(() => {
    if (decodeToken()?.user.role === "Vendedor") {
      setSelectedSeller(decodeToken()?.user.Id);
      getGastosByVendedor();
    } else {
      if (VendedorSelectedContext) {
        setSelectedSeller(VendedorSelectedContext);
        getGastosByVendedor();
      }
      getGastos();
    }
  }, [activeView === "gastosPorVendedor"]);

  const SellersOptions = vendedores.map((seller) => ({
    value: seller.Id,
    label: seller.NombreCompleto,
  }));

  const handleSelectSeller = (sellerId: string | undefined) => {
    if (sellerId !== null) {
      setSelectedSeller(Number(sellerId));
    }
  };

  return (
    <section>
      <Sidebar />
      <div className="flex flex-col justify-center text-3xl font-bold ml-[64px]">
        <header className="flex justify-center w-full border-b shadow-md bg-white">
          <h1 className="text-2xl text-primary md:text-4xl lg:text-6xl text-start md:text-center p-2 w-full">
            Gastos
          </h1>
        </header>
        <ul className="flex text-base font-normal rounded-lg w-full justify-end px-1 md:px-0">
          <li
            className={`w-full md:w-1/4 lg:w-1/6 cursor-pointer select-none px-2 py-2 text-sm md:text-base text-center ${
              activeView === "tiposDeGastos"
                ? "bg-primary text-white"
                : "bg-white text-black"
            } transition-colors duration-300 ease-in-out`}
            onClick={() => setActiveView("tiposDeGastos")}
          >
            Tipos de Gastos
          </li>
          <li
            className={`w-full md:w-1/4 lg:w-1/6 cursor-pointer select-none px-2 py-2 text-sm md:text-base text-center ${
              activeView === "gastosPorVendedor"
                ? "bg-primary text-white"
                : "bg-white text-black"
            } transition-colors duration-300 ease-in-out`}
            onClick={() => setActiveView("gastosPorVendedor")}
          >
            {decodeToken().user.role === "Administrador"
              ? "Gastos por vendedor "
              : "Tus Gastos"}
          </li>
        </ul>
        <NuevoTipoGastoModal
          isOpen={isOpenTIpoGastoModal}
          onClose={() => setIsOpenTipoGastoModal(false)}
          getGastos={getTiposGastos}
        />
        <ModificarTipoGastoModal
          isOpen={isOpenEditGastoModal}
          onClose={() => setIsOpenEditGastoModal(false)}
          getGastos={getTiposGastos}
          GastoId={TipoGastoId}
        />
        <ModalDeleteTipoGasto
          isOpen={isOpenDeleteTipoGastoModal}
          onClose={() => setIsOpenDeleteTipoGastoModal(false)}
          getTipoGastos={getTiposGastos}
          Id={TipoGastoId}
        />
        <div>
          {activeView === "tiposDeGastos" ? (
            <div className="px-4">
              <div className="w-full flex justify-between items-center">
                <h4 className="text-primary py-2 text-xl md:text-2xl lg:text-3xl">
                  Tipos de Gastos:
                </h4>
                {decodeToken()?.user.role === "Administrador" && (
                  <button
                    className="mx-4 text-primary"
                    onClick={() => setIsOpenTipoGastoModal(true)}
                  >
                    <AddCircleIcon fontSize="large" />
                  </button>
                )}
              </div>
              {isLoading ? (
                <div className="w-full h-[70vh] flex items-center justify-center">
                  <Spinner isLoading={isLoading} />
                </div>
              ) : (
                <ul className="w-full text-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {gastos.map((gasto) => (
                    <li
                      className="bg-white border rounded-md p-1 break-words"
                      key={gasto.GastoId}
                    >
                      <div className="w-full flex bg-primary text-white py-4 text-xl rounded-lg p-2 font-medium justify-between">
                        <PaymentsIcon fontSize="large" />
                        <h4>{gasto.Nombre}</h4>
                        {decodeToken()?.user.role === "Administrador" && (
                          <div className="relative inline-block text-left">
                            <div>
                              <button
                                type="button"
                                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm p-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                                id="options-menu"
                                aria-haspopup="true"
                                aria-expanded="true"
                                onClick={() =>
                                  setOpenDropdownTipoId(
                                    openDropdownTipoId !== gasto.GastoId
                                      ? gasto.GastoId
                                      : null
                                  )
                                }
                              >
                                <EditNoteIcon fontSize="medium" />
                              </button>
                              {openDropdownTipoId === gasto.GastoId && (
                                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-50 ring-1 ring-black ring-opacity-5">
                                  <div
                                    className="py-1"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="options-menu"
                                  >
                                    <button
                                      className="block px-4 py-2 text-sm text-gray-700 font-normal hover:bg-gray-200 hover:text-gray-900 w-full"
                                      onClick={() => {
                                        toggleTipoGastoEditModal(gasto.GastoId);
                                        setOpenDropdownTipoId(null);
                                      }}
                                    >
                                      Modificar
                                    </button>
                                    <button
                                      className="block px-4 py-2 text-sm text-gray-700 font-normal hover:bg-gray-200 hover:text-gray-900 w-full"
                                      onClick={() => {
                                        setOpenDropdownTipoId(null);
                                        setIsOpenDeleteTipoGastoModal(true);
                                        setTipoGastoId(gasto.GastoId);
                                      }}
                                    >
                                      Eliminar
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-primary py-2 break-words">
                        <DescriptionIcon />
                        <span className="px-2 w-[90%] text-wrap">
                          <h6 className="font-semibold text-primary text-lg">
                            Descripcion:
                          </h6>
                          <p className="font-normal text-black">
                            {gasto.Descripcion}
                          </p>
                        </span>
                      </div>
                      <div className="flex items-center text-primary py-2">
                        <SellIcon />
                        <span className="px-2">
                          <h6 className="font-semibold text-primary text-lg">
                            Monto Maximo:{" "}
                          </h6>
                          <p className="text-black font-normal">
                            {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                            }).format(gasto.MontoMaximo)}
                            $
                          </p>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="px-2 md:px-4">
              <div className="w-full py-5 flex flex-col md:flex-row items-center justify-center">
                <div className="md:w-1/2 flex font-normal text-sm md:text-lg">
                  <Select
                    id="seller"
                    options={SellersOptions}
                    placeholder="Seleccione un vendedor"
                    onChange={(selectedOption) =>
                      handleSelectSeller(selectedOption?.value.toString())
                    }
                    isSearchable
                    isDisabled={decodeToken()?.user?.role === "Vendedor"}
                    defaultValue={SellersOptions.find(
                      (option) => option.value === selectedSeller
                    )}
                    maxMenuHeight={170}
                    menuPlacement="auto"
                    className="w-full"
                  />
                  <button
                    className="border-md text-white bg-primary text-base px-2"
                    onClick={() => {
                      getGastosByVendedor();
                      setSearched(true);
                    }}
                  >
                    Buscar
                  </button>
                </div>
                <button
                  className="flex mt-5 md:mt-0 w-full md:w-[50px] items-center justify-center text-white"
                  onClick={() => setIsOpenModal(true)}
                >
                  <AddCircleIcon
                    fontSize="large"
                    className="text-primary absolute md:right-5"
                  />
                </button>
              </div>
              <div>
                <h4 className="text-primary py-2 text-xl md:text-2xl lg:text-3xl text-center md:text-start">
                  Gastos por vendedor:
                </h4>
                <NuevoGastoModal
                  isOpen={isOpenModal}
                  onClose={() => setIsOpenModal(false)}
                  refreshGastos={getGastos}
                  handleSearch={getGastosByVendedor}
                />
                <ModificarGastoModal
                  isOpen={isOpenEditModal}
                  onClose={() => setIsOpenEditModal(false)}
                  getGastos={getTiposGastos}
                  Id={Id}
                />
                <ModalDeleteGasto
                  isOpen={isOpenDeleteGastoModal}
                  onClose={() => setIsOpenDeleteGastoModal(false)}
                  getGastos={getGastos}
                  Id={Id}
                />
                {isLoading ? (
                  <div className="w-full h-[70vh] flex items-center justify-center">
                    <Spinner isLoading={isLoading} />
                  </div>
                ) : (
                  <ul className="w-full text-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {gastosPorVendedor.map((gasto) => (
                      <li
                        className="bg-white border rounded-md p-1 text-wrap break-words"
                        key={gasto.Id}
                      >
                        <div className="flex flex-col items-center w-full text-white bg-primary rounded-md p-4">
                          <div className="w-full text-xl font-semibold flex justify-between">
                            <h6 className="text-center">
                              {gasto.NombreVendedor}
                            </h6>
                            {decodeToken()?.user.role === "Administrador" && (
                              <div className="relative inline-block text-left">
                                <div>
                                  <button
                                    type="button"
                                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm p-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                                    id="options-menu"
                                    aria-haspopup="true"
                                    aria-expanded="true"
                                    onClick={() =>
                                      setOpenDropdownId(
                                        openDropdownId !== gasto.Id
                                          ? gasto.Id
                                          : null
                                      )
                                    }
                                  >
                                    <EditNoteIcon fontSize="medium" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                          <span
                            className={`rounded-md p-1 ${
                              gasto.Liquidado ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            {gasto.Liquidado ? "Liquidado" : "Pendiente"}
                          </span>
                        </div>

                        <div className="flex items-center my-2 text-secondary">
                          <SellIcon />
                          <span className="mx-2">
                            <h6>Nombre Gasto:</h6>
                            <p className="font-normal text-black">
                              {gasto.Nombre}
                            </p>
                          </span>
                        </div>
                        <div className="w-full flex items-center my-2 text-secondary">
                          <DescriptionIcon />
                          <span className="mx-2 w-[90%] break-words">
                            <h6>Descripcion Gasto: </h6>
                            <p className="font-normal text-black">
                              {gasto.Descripcion}
                            </p>
                          </span>
                        </div>
                        <div className="flex items-center my-2 text-secondary">
                          <AttachMoneyIcon />
                          <span className="mx-2">
                            <h6>Valor del gasto:</h6>
                            <p className="font-normal text-black">
                              {new Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                              }).format(gasto.Monto)}
                              $
                            </p>
                          </span>
                        </div>
                        <div className="flex items-center text-secondary">
                          <CalendarMonthIcon />
                          <span className="mx-2">
                            <h6>Fecha del gasto:</h6>
                            <p className="font-normal text-black">
                              {formatDate(gasto.Fecha)}
                            </p>
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Gastos;
