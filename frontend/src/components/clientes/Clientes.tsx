import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import decodeToken from "../../utils/tokenDecored";
import PersonIcon from "@mui/icons-material/Person";
import PinDropIcon from "@mui/icons-material/PinDrop";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SellIcon from "@mui/icons-material/Sell";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import NuevoClienteModal from "../../utils/Clientes/NuevoClienteModal";
import ModificarClienteModal from "../../utils/Clientes/ModificarClienteModal";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ModalTest from "../ModalDeleteClient";
import Spinner from "../../utils/Spinner";

function Clientes() {
  interface Client {
    Id: number;
    NombreCompleto: string;
    Correo: string;
    NumeroDocumento: string;
    Telefono: string;
    Direccion: string;
    ValorDeuda: number;
  }

  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [isDeleteRequest, setIsDeleteRequest] = useState<boolean>(false);
  const [Id, setId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const toggleEditModal = (id: number) => {
    setId(id);
    setIsEditModalOpen(!isEditModalOpen);
  };

  const toggleCloseConfirmation = (id: number) => {
    setId(id);
    setIsDeleteRequest(!isDeleteRequest);
  };

  const VendedorId = decodeToken()?.user.Id;

  const getClients = () => {
    setIsLoading(true);
    if (decodeToken()?.user.role !== "Administrador") {
      axios
        .get(`https://backendgestorventas.azurewebsites.net/api/clientes/vendedor/${VendedorId}`)
        .then((res) => {
          setClients(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } else {
      axios
        .get("https://backendgestorventas.azurewebsites.net/api/clientes")
        .then((res) => {
          setClients(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  return (
    <section className="w-full overflow-hidden min-h-screen">
      <Sidebar />
      <div className="flex flex-col justify-center text-3xl font-bold ml-[64px]">
        <header className="flex justify-center w-full border-b shadow-md bg-white mb-4">
          <h1 className="text-2xl text-blue-900 md:text-4xl lg:text-6xl text-start md:text-center p-2 w-full">
            {decodeToken()?.user.role === "Administrador"
              ? "Clientes"
              : "Tus Clientes"}
          </h1>
          <button className="mx-4 text-blue-900">
            <AddCircleIcon fontSize="large" onClick={toggleModal} />
          </button>
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
                    className="w-full p-2 rounded-md border flex flex-col bg-white shadow-md md:hover:scale-105 transition-transform duration-100"
                    key={client.Id}
                  >
                    <div className="flex flex-col">
                      <section className="w-full p-2 flex items-center justify-between rounded-md bg-blue-900 text-white">
                        <PersonIcon fontSize="large" className="text-white" />
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
                                    <button className="block px-4 py-2 text-sm text-gray-700 font-normal hover:bg-gray-200 hover:text-gray-900 w-full">
                                      Compras
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
                            <p>{client.Direccion}</p>
                          </span>
                        </li>
                        <li className="flex items-center my-1">
                          <EmailIcon className="text-blue-800" />
                          <span className="mx-4">
                            <h3 className="font-bold">Email:</h3>
                            <p className="overflow-ellipsis overflow-hidden w-40 md:w-full">
                              {client.Correo}
                            </p>
                          </span>
                        </li>
                        <li className="flex items-center my-1">
                          <PhoneIcon className="text-blue-800" />
                          <span className="mx-4">
                            <h3 className="font-bold">Telefono:</h3>
                            <p>{client.Telefono}</p>
                          </span>
                        </li>
                        <li className="flex items-center my-1">
                          <SellIcon className="text-blue-800" />
                          <span className="mx-4">
                            <h3 className="font-bold">Valor Deuda:</h3>
                            <p>{new Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                              }).format(client.ValorDeuda)}</p>
                          </span>
                        </li>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}

export default Clientes;
