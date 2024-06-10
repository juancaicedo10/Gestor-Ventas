import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PaginationButtons from "../../helpers/paginator";
import decodeToken from "../../utils/tokenDecored";
import PersonIcon from "@mui/icons-material/Person";
import Dropdown from "../../utils/DropDown";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PinDropIcon from '@mui/icons-material/PinDrop';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SellIcon from '@mui/icons-material/Sell';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NuevoClienteModal from "../../utils/NuevoClienteModal";

function Clientes() {
  interface Client {
    NombreCompleto: string;
    Correo: string;
    NumeroDocumento: string;
    Telefono: string;
    Direccion: string;
  }

  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    axios
      .get("https://backendgestorventas.azurewebsites.net/api/clientes?page=1&limit=3")
      .then((res) => setClients(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="w-full overflow-y-hidden">
      <Sidebar />
      <div className="flex flex-col justify-center text-3xl font-bold ml-[64px]">
      <header className="flex justify-center w-full border-b shadow-md bg-white">
          <h1 className="text-2xl text-blue-900 md:text-4xl lg:text-6xl text-center py-2 w-full">
            Clientes
          </h1>
          <button className="mx-4 text-blue-900">
            <AddCircleIcon fontSize="large" onClick={toggleModal}/>
          </button>
        </header>
        <section className="w-full px-2">
          <NuevoClienteModal isOpen={isModalOpen} onClose={toggleModal}/>
          <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 place-items-start rounded-md">
            {clients.map((client, Id) => (
              <li
                className="w-full p-2 min-h-[260px] rounded-md border flex flex-col bg-white shadow-md md:hover:scale-105 transition-transform duration-100"
                key={Id}
              >
                <div className="flex flex-col">
                <section className="w-full p-2 flex items-center justify-between rounded-md bg-blue-900 text-white">
                <PersonIcon fontSize="large" className="text-white" />
                <span>
                <h1 className="font-normal text-xl">{ client.NombreCompleto }</h1>
                <p className="text-gray-300 font-light py-2 text-lg">CC. { client.NumeroDocumento }</p>
                </span>
                {
                  decodeToken()?.role === "Administrador" && (
                    <Dropdown />
                  )
                }
                </section>
                  <div className="text-lg font-light flex flex-col">
                    <li className="flex items-center my-1">
                      <ShoppingCartIcon className="text-blue-800"/>
                      <span className="mx-4">
                      <h3 className="font-bold">Producto:</h3>
                      <p>{client.NombreCompleto}</p>
                      </span>
                    </li>
                    <li className="flex items-center my-1">
                      <PinDropIcon className="text-blue-800"/>
                      <span className="mx-4">
                      <h3 className="font-bold">Direccion:</h3>
                      <p>Trans 42F N-42C#18{client.Direccion}</p>
                      </span>
                    </li>
                    <li className="flex items-center my-1">
                      <EmailIcon className="text-blue-800"/>
                      <span className="mx-4">
                      <h3 className="font-bold">Email:</h3>
                      <p>{client.Correo}</p>
                      </span>
                    </li>
                    <li className="flex items-center my-1">
                      <PhoneIcon className="text-blue-800"/>
                      <span className="mx-4">
                      <h3 className="font-bold">Telefono:</h3>
                      <p>{client.Telefono}</p>
                      </span>
                    </li>
                    <li className="flex items-center my-1">
                      <SellIcon className="text-blue-800"/>
                      <span className="mx-4">
                      <h3 className="font-bold">Valor Deuda:</h3>
                      <p>${'0'}</p>
                      </span>
                    </li>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <PaginationButtons page={1} />
      </div>
    </section>
  );
}

export default Clientes;
