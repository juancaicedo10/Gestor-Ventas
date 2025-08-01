import { useState, useEffect } from "react";

import _ from "lodash";
import Sidebar from "../Sidebar";
import decodeToken from "../../utils/tokenDecored";
import PinDropIcon from "@mui/icons-material/PinDrop";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import NuevoClienteModal from "../../utils/Clientes/NuevoClienteModal";
import ModificarClienteModal from "../../utils/Clientes/ModificarClienteModal";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ModalTest from "./ModalDeleteClient";
import Spinner from "../../utils/Spinner";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import WorkIcon from "@mui/icons-material/Work";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Link } from "react-router-dom";
import { useVendedorContext } from "../../utils/Context/VendedorSelectedContext";
import { Tooltip } from "@mui/material";
import HttpClient from "../../Services/httpService";

function Clientes() {
  interface Client {
    Id: number;
    NombreCompleto: string;
    Correo: string;
    NumeroDocumento: string;
    Telefono: string;
    Direccion: string;
    Ocupacion: string;
    Detalle: string;
    ValorDeuda: number;
    Foto: string;
  }

  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [isDeleteRequest, setIsDeleteRequest] = useState<boolean>(false);
  const [Id, setId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(0);

  const [pageCount, setPageCount] = useState(1);

  const [searchValue, setSearchValue] = useState<string>("");

  const handlePageClick = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const toggleEditModal = (id: number) => {
    setId(id);
    setIsEditModalOpen(!isEditModalOpen);
  };

  const { VendedorSelectedContext } = useVendedorContext();

  const toggleCloseConfirmation = (id: number) => {
    setId(id);
    setIsDeleteRequest(!isDeleteRequest);
  };

  const VendedorId = decodeToken()?.user.Id;

  const getClients = () => {
    setIsLoading(true);
    if (decodeToken()?.user.role !== "Administrador") {
      HttpClient.get(
          `${import.meta.env.VITE_API_URL}/api/clientes/vendedor/${VendedorId}`,
          {
            params: {
              page: currentPage + 1,
              limit: 8,
              search: searchValue,
            },
          }
        )
        .then((res) => {
          setClients(res.data.data);
          setPageCount(res.data.totalPages);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } else if (VendedorSelectedContext && VendedorSelectedContext !== 0 && decodeToken()?.user.role === "Administrador") {
      HttpClient.get(
          `${import.meta.env.VITE_API_URL}/api/clientes/vendedor/${VendedorSelectedContext}`,
          {
            params: {
              page: currentPage + 1,
              limit: 8,
              search: searchValue,
            },
          }
        )
        .then((res) => {
          setClients(res.data.data);
          setPageCount(res.data.totalPages);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } else {
      HttpClient.get(
          `${import.meta.env.VITE_API_URL}/api/clientes/${
            decodeToken()?.user?.Id
          }/all`,
          {
            params: {
              page: currentPage + 1,
              limit: 8,
              search: searchValue,
            },
          }
        )
        .then((res) => {
          setClients(res.data.data);
          setPageCount(res.data.totalPages);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchValue(value);
  };

  useEffect(() => {
    if (searchValue !== "") {
      const handler = setTimeout(() => {
        setCurrentPage(0); // Reinicia la página solo cuando se realiza una nueva búsqueda
        getClients();
      }, 400);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [searchValue]);

  useEffect(() => {
    getClients();
  }, [currentPage, searchValue === ""]);

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

  return (
    <section className="w-full overflow-hidden min-h-screen">
      <Sidebar />
      <div className="flex flex-col justify-center text-3xl font-bold ml-[64px]">
        <header className="flex flex-col w-full border-b shadow-md bg-white mb-4">
          <div className="flex w-full">
            <h1 className="text-2xl text-primary md:text-4xl lg:text-6xl text-start md:text-center p-2 w-full">
              {decodeToken()?.user.role === "Administrador"
                ? "Clientes"
                : "Tus Clientes"}
            </h1>
            <button className="mx-4 text-primary">
              <GroupAddIcon fontSize="large" onClick={toggleModal} />
            </button>
          </div>
          <div className="flex justify-center items-center px-1">
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
          </div>
        </header>
        <section
          className={`w-full px-2 ${
            isLoading ? "flex items-center justify-center h-screen" : ""
          }`}
        >
          <NuevoClienteModal
            isOpen={isModalOpen}
            onClose={toggleModal}
            getClients={getClients}
          />
          {isLoading ? (
            <Spinner isLoading={isLoading} />
          ) : (
            <>
              <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 place-items-start rounded-md">
                {isEditModalOpen && (
                  <ModificarClienteModal
                    Id={Id}
                    isOpen={isEditModalOpen}
                    getClients={getClients}
                    onClose={() => toggleEditModal(Id)}
                  />
                )}
                {isDeleteRequest && (
                  <ModalTest
                    isOpen={true}
                    onClose={() => toggleCloseConfirmation(Id)}
                    getClients={getClients}
                    Id={Id}
                  />
                )}
                {clients.map((client) => {
                  return (
                    <li
                      className="w-full p-2 rounded-md border flex flex-col bg-white shadow-md md:hover:scale-105 transition-transform duration-100 min-h-full"
                      key={client.Id}
                    >
                      <div className="flex flex-col">
                        <section className="w-full p-2 flex items-center justify-between rounded-md bg-primary text-white">
                          <img
                            src={client.Foto}
                            className="w-16 h-16 rounded-full"
                          />
                          <span>
                            <h1 className="font-normal text-xl">
                              {client.NombreCompleto.split(" ")
                                .slice(0, 2)
                                .join(" ")}
                            </h1>
                            <p className="text-gray-300 font-light py-2 text-lg">
                              CC. {client.NumeroDocumento}
                            </p>
                          </span>
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
                                      openDropdownId !== client.Id
                                        ? client.Id
                                        : null
                                    )
                                  }
                                >
                                  <EditNoteIcon fontSize="medium" />
                                </button>
                                {openDropdownId === client.Id && (
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
                                          toggleEditModal(client.Id);
                                          setOpenDropdownId(null);
                                        }}
                                      >
                                        Modificar
                                      </button>
                                      <button
                                        className="block px-4 py-2 text-sm text-gray-700 font-normal hover:bg-gray-200 hover:text-gray-900 w-full"
                                        onClick={() => {
                                          toggleCloseConfirmation(client.Id);
                                          setOpenDropdownId(null);
                                        }}
                                      >
                                        Eliminar
                                      </button>
                                      <Link
                                        to={`/ventas/cliente/${client.Id}`}
                                        className="block px-4 py-2 text-sm text-gray-700 font-normal hover:bg-gray-200 hover:text-gray-900 w-full text-center"
                                
                                        rel="noopener noreferrer"
                                        onClick={() => setOpenDropdownId(null)}
                                      >
                                        Compras
                                      </Link>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </section>
                        <div className="text-lg font-light flex flex-col">
                          <li className="flex items-center my-1">
                            <PinDropIcon className="text-secondary" />
                            <span className="mx-4">
                              <h3 className="font-bold">Direccion:</h3>
                              <p>{client.Direccion}</p>
                            </span>
                          </li>
                          <li className="flex items-center my-1">
                            <EmailIcon className="text-secondary" />
                            <span className="mx-4">
                              <h3 className="font-bold">Email:</h3>
                              <p className="overflow-ellipsis overflow-hidden w-40 md:w-full">
                                {client.Correo}
                              </p>
                            </span>
                          </li>
                          <li className="flex items-center my-1">
                            <PhoneIcon className="text-secondary" />
                            <span className="mx-4">
                              <h3 className="font-bold">Telefono:</h3>
                              <p className="border-b border-quaternary text-quaternary">
                                <a
                                  href={`https://wa.me/${client.Telefono}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {client.Telefono}
                                </a>
                              </p>
                            </span>
                          </li>
                          <li className="flex items-center my-1">
                            <WorkIcon className="text-secondary" />
                            <span className="mx-4">
                              <h3 className="font-bold">Ocupacion:</h3>
                              <Tooltip title={client.Ocupacion} arrow>
                                <p className="font-light tresPuntos">
                                  {client.Ocupacion}
                                </p>
                              </Tooltip>
                            </span>
                          </li>

                          <li className="flex items-center my-1">
                            <BorderColorIcon className="text-secondary" />
                            <span className="mx-4">
                              <h3 className="font-bold">Detalle:</h3>
                              <Tooltip title={client.Detalle} arrow>
                                <p className="font-light tresPuntos">
                                  {client.Detalle}
                                </p>
                              </Tooltip>
                            </span>
                          </li>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="flex justify-center mt-4 text-sm">
                {visibleRange[0] > 0 && (
                  <button
                    className="mx-1 px-3 py-1 border rounded-md bg-white text-tertiary font-normal"
                    onClick={handlePrevRange}
                  >
                    Anterior
                  </button>
                )}
                {visiblePages.map((index) => (
                  <button
                    key={index}
                    className={`mx-1 px-3 py-1 border rounded-md font-normal ${
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
                    className="mx-1 px-3 py-1 border rounded bg-white text-tertiary font-normal"
                    onClick={handleNextRange}
                  >
                    Siguiente
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </section>
  );
}

export default Clientes;
