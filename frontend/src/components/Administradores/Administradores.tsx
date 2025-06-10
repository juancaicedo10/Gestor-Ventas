import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import decodeToken from "../../utils/tokenDecored";
import PinDropIcon from "@mui/icons-material/PinDrop";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Spinner from "../../utils/Spinner";
import NuevoAdministradorModal from "./ModalCrearAdmin";
import ModificarAdministradorModal from "./ModalEditAdmin";
import RelacionAdministradorVendedorModal from "./AdminVendedorRelacionModal";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import AdminDeleteModal from "./ModarDeleteAdmin";

function Administradores() {
  // Definiciones de estado e interfaces
  interface Client {
    Id: number;
    NombreCompleto: string;
    Correo: string;
    NumeroDocumento: string;
    Telefono: string;
    Direccion: string;
    TotalVentas: number;
    Foto: string;
  }

  const [Administradores, setAdministradores] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [isDeleteRequest, setIsDeleteRequest] = useState<boolean>(false);
  const [isRelacionOpen, setIsRelacionOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [Id, setId] = useState<number>(0);
  const [deleteMdal, setDeleteModal] = useState<boolean>(false);

  // Funciones para manejar los modales
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleEditModal = (Id: number) => {
    setId(Id);
    setIsEditModalOpen(!isEditModalOpen);
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteMdal);
  };

  console.log(isDeleteRequest);

  // Función para obtener la lista de Administradores
  const getAdministradores = () => {
    setIsLoading(true);
    axios
      .get("https://backendgestorventas1.azurewebsites.net/api/administradores")
      .then((res) => {
        setAdministradores(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    const value = e.target.value;

    if (value !== "") {
      const filtrados = Administradores.filter((Administrador) =>
        Administrador.NombreCompleto.toLowerCase().includes(value.toLowerCase())
      );
      setAdministradores(filtrados);
    } else {
      getAdministradores();
    }
  };

  useEffect(() => {
    getAdministradores();
  }, []);

  return (
    <section className="w-full overflow-y-hidden">
      <Sidebar />
      <div className="flex flex-col justify-center text-3xl font-bold ml-[64px]">
        <header className="flex flex-col w-full border-b shadow-md bg-white mb-4">
          <div className="flex w-full">
            <h1 className="text-2xl text-blue-900 md:text-4xl lg:text-6xl text-start md:text-center p-2 w-full">
              Administradores
            </h1>
            <button className="mx-4 text-blue-900">
              <SyncAltIcon
                fontSize="large"
                onClick={() => setIsRelacionOpen(true)}
              />
            </button>
            <button className="mx-4 text-blue-900">
              <AddCircleIcon fontSize="large" onClick={toggleModal} />
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
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-3 ps-10 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Buscar Administrador"
                  onChange={handleSearch}
                  required
                />
                <button
                  type="submit"
                  className="text-white absolute end-2.5 bottom-2.5 bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>
        </header>
        <div
          className={`w-full flex items-center justify-center ${
            isLoading ? "h-screen" : ""
          } `}
        >
          {isLoading ? (
            <Spinner isLoading={isLoading} />
          ) : (
            <section className="w-full px-2">
              <NuevoAdministradorModal
                isOpen={isModalOpen}
                onClose={toggleModal}
                getClients={getAdministradores}
              />
              <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 place-items-start rounded-md overflow-hidden">
                {isEditModalOpen && (
                  <ModificarAdministradorModal
                    Id={Id}
                    isOpen={isEditModalOpen}
                    getAdministradores={getAdministradores}
                    onClose={() => toggleEditModal(Id)}
                  />
                )}
                {
                  <RelacionAdministradorVendedorModal
                    isOpen={isRelacionOpen}
                    onClose={() => setIsRelacionOpen(false)}
                  />
                }
                {
                  <AdminDeleteModal
                    Id={Id}
                    isOpen={deleteMdal}
                    onClose={toggleDeleteModal}
                    getAdministradores={getAdministradores}
                  />
                }
                {Administradores.map((Administrador) => {
                  return (
                    <li
                      className="w-full p-2 min-h-[260px] rounded-md border flex flex-col bg-white shadow-md md:hover:scale-105 transition-transform duration-100"
                      key={Administrador.Id}
                    >
                      <div className="flex flex-col">
                        <section className="w-full p-2 flex items-center justify-between rounded-md bg-blue-900 text-white">
                          <span>
                            <h1 className="font-normal text-xl">
                              {Administrador.NombreCompleto.split(" ")
                                .slice(0, 2)
                                .join(" ")}
                            </h1>
                            <p className="text-gray-300 font-light py-2 text-lg">
                              CC. {Administrador.NumeroDocumento}
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
                                      openDropdownId !== Administrador.Id
                                        ? Administrador.Id
                                        : null
                                    )
                                  }
                                >
                                  <EditNoteIcon fontSize="medium" />
                                </button>
                                {openDropdownId === Administrador.Id && (
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
                                          setId(Administrador.Id);
                                          setIsEditModalOpen(true);
                                          setOpenDropdownId(null);
                                        }}
                                      >
                                        Modificar
                                      </button>
                                      <button
                                        className="block px-4 py-2 text-sm text-gray-700 font-normal hover:bg-gray-200 hover:text-gray-900 w-full"
                                        onClick={() => {
                                          setId(Administrador.Id);
                                          setIsDeleteRequest(true);
                                          setOpenDropdownId(null);
                                          toggleDeleteModal();
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
                        </section>
                        <div className="text-lg font-light flex flex-col">
                          <li className="flex items-center my-1">
                            <PinDropIcon className="text-blue-800" />
                            <span className="mx-4">
                              <h3 className="font-bold">Direccion:</h3>
                              <p>{Administrador.Direccion}</p>
                            </span>
                          </li>
                          <li className="flex items-center my-1">
                            <EmailIcon className="text-blue-800" />
                            <span className="mx-4">
                              <h3 className="font-bold">Email:</h3>
                              <p>{Administrador.Correo}</p>
                            </span>
                          </li>
                          <li className="flex items-center my-1">
                            <PhoneIcon className="text-blue-800" />
                            <span className="mx-4">
                              <h3 className="font-bold">Telefono:</h3>
                              <p className="border-b border-blue-600 text-blue-600">
                                <a
                                  href={`https://wa.me/${Administrador.Telefono}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {Administrador.Telefono}
                                </a>
                              </p>
                            </span>
                          </li>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}

export default Administradores;
