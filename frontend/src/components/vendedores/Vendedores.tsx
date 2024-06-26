import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import decodeToken from "../../utils/tokenDecored";
import PinDropIcon from "@mui/icons-material/PinDrop";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SellIcon from "@mui/icons-material/Sell";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import NuevoVendedorModal from "../../utils/vendedores/NuevoVendedorModal";
import ModificarVendedorModal from "../../utils/vendedores/ModificarVendedorModal";
import EditNoteIcon from "@mui/icons-material/EditNote";
import VendedorDeleteModal from "../ModalDeleteVendedor";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Spinner from "../../utils/Spinner";
import { Link } from "react-router-dom";

function Vendedores() {
  // Definiciones de estado e interfaces
  interface Client {
    Id: number;
    NombreCompleto: string;
    Correo: string;
    NumeroDocumento: string;
    Telefono: string;
    Direccion: string;
    VentasTotales: number;
  }

  const [vendedores, setVendedores] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [isDeleteRequest, setIsDeleteRequest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [Id, setId] = useState<number>(0);

  // Funciones para manejar los modales
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleEditModal = (Id: number) => {
    setId(Id);
    setIsEditModalOpen(!isEditModalOpen);
  };

  const closeDeleteModal = () => {
    setIsDeleteRequest(false);
    setId(0);
  };

  // Función para obtener la lista de vendedores
  const getVendedores = () => {
    setIsLoading(true);
    axios
      .get("https://backendgestorventas.azurewebsites.net/api/vendedores")
      .then((res) => {
        setVendedores(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getVendedores();
  }, []);

  return (
    <section className="w-full overflow-y-hidden">
      <Sidebar />
      <div className="flex flex-col justify-center text-3xl font-bold ml-[64px]">
        <header className="flex justify-center w-full border-b shadow-md bg-white mb-4">
          <h1 className="text-2xl text-blue-900 md:text-4xl md:text-center lg:text-6xl text-start p-2 w-full">
            Vendedores
          </h1>
          <button className="mx-4 text-blue-900">
            <AddCircleIcon fontSize="large" onClick={toggleModal} />
          </button>
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
              <NuevoVendedorModal
                isOpen={isModalOpen}
                onClose={toggleModal}
                getClients={getVendedores}
              />
              <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 place-items-start rounded-md overflow-hidden min-h-screen">
                {isEditModalOpen && (
                  <ModificarVendedorModal
                    Id={Id}
                    isOpen={isEditModalOpen}
                    getVendedores={getVendedores}
                    onClose={() => toggleEditModal(Id)}
                  />
                )}
                {isDeleteRequest && (
                  <VendedorDeleteModal
                    isOpen={true}
                    onClose={closeDeleteModal}
                    getVendedores={getVendedores}
                    Id={Id}
                  />
                )}
                {vendedores.map((vendedor) => {
                  return (
                    <li
                      className="w-full p-2 min-h-[260px] rounded-md border flex flex-col bg-white shadow-md md:hover:scale-105 transition-transform duration-100"
                      key={vendedor.Id}
                    >
                      <div className="flex flex-col">
                        <section className="w-full p-2 flex items-center justify-between rounded-md bg-blue-900 text-white">
                          <SellIcon fontSize="large" className="text-white" />
                          <span>
                            <h1 className="font-normal text-xl">
                              {vendedor.NombreCompleto.split(" ")
                                .slice(0, 2)
                                .join(" ")}
                            </h1>
                            <p className="text-gray-300 font-light py-2 text-lg">
                              CC. {vendedor.NumeroDocumento}
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
                                      openDropdownId !== vendedor.Id
                                        ? vendedor.Id
                                        : null
                                    )
                                  }
                                >
                                  <EditNoteIcon fontSize="medium" />
                                </button>
                                {openDropdownId === vendedor.Id && (
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
                                          setId(vendedor.Id);
                                          setIsEditModalOpen(true);
                                          setOpenDropdownId(null);
                                        }}
                                      >
                                        Modificar
                                      </button>
                                      <button
                                        className="block px-4 py-2 text-sm text-gray-700 font-normal hover:bg-gray-200 hover:text-gray-900 w-full"
                                        onClick={() => {
                                          setId(vendedor.Id);
                                          setIsDeleteRequest(true);
                                          setOpenDropdownId(null);
                                        }}
                                      >
                                        Eliminar
                                      </button>
                                      <button className="block px-4 py-2 text-sm text-gray-700 font-normal hover:bg-gray-200 hover:text-gray-900 w-full">
                                        Ventas
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
                              <p>{vendedor.Direccion}</p>
                            </span>
                          </li>
                          <li className="flex items-center my-1">
                            <EmailIcon className="text-blue-800" />
                            <span className="mx-4">
                              <h3 className="font-bold">Email:</h3>
                              <p>{vendedor.Correo}</p>
                            </span>
                          </li>
                          <li className="flex items-center my-1">
                            <PhoneIcon className="text-blue-800" />
                            <span className="mx-4">
                              <h3 className="font-bold">Telefono:</h3>
                              <p>{vendedor.Telefono}</p>
                            </span>
                          </li>
                          <li className="flex items-center my-1">
                            <SellIcon className="text-blue-800" />
                            <span className="mx-4">
                              <h3 className="font-bold">Ventas totales:</h3>
                              <p>{ vendedor.VentasTotales }</p>
                            </span>
                          </li>
                          <li className="flex items-center my-1">
                            <StorefrontIcon className="text-blue-800" />
                            <span className="mx-4">
                              <h3 className="font-bold">Ventas totales:</h3>
                              <Link to={`/ventas/vendedor/${vendedor.Id}`}>
                                <p className="text-blue-600 hover:text-blue-900 cursor-pointer">
                                  Ir a las ventas
                                </p>
                              </Link>
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

export default Vendedores;
