import { useState, useEffect } from "react";
import axios from "axios";
import SellIcon from "@mui/icons-material/Sell";
import Sidebar from "../Sidebar";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PaginationButtons from "../../helpers/paginator";
import decodeToken from "../../utils/tokenDecored";
import PersonIcon from "@mui/icons-material/Person";
import EditNoteIcon from '@mui/icons-material/EditNote';
import Dropdown from "../../utils/DropDown";

function Clientes() {
  interface Client {
    NombreCompleto: string;
    Correo: string;
    NumeroDocumento: string;
    Telefono: string;
  }

  const [clients, setClients] = useState<Client[]>([]);

  const user = decodeToken()?.user.ID;

  useEffect(() => {
    axios
      .get("https://proyecto-cristian-3n3fv0e7g-jayz1xs-projects.vercel.app/api/clientes?page=1&limit=3")
      .then((res) => setClients(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="w-full overflow-y-hidden">
      <Sidebar />
      <div className="flex px-2 flex-col justify-center text-3xl font-bold ml-[64px]">
      <h1 className="my-2 text-3xl text-blue-800 md:text-4xl lg:text-6xl text-start border-b-4 py-2 border-blue-800 w-full">
            Clientes
          </h1>
        <section className="w-full">
          <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 place-items-start rounded-md">
            {clients.map((client, Id) => (
              <li
                className="w-full p-2 min-h-[260px] rounded-md border flex flex-col bg-white shadow-md md:hover:scale-105 transition-transform duration-100"
                key={Id}
              >
                <div className="flex flex-col">
                <section className="w-full flex items-center justify-between">
                <PersonIcon fontSize="large" className="text-blue-800" />
                {
                  decodeToken()?.role === "Administrador" && (
                    <Dropdown />
                  )
                }
                </section>
                <h2 className="text-xl text-start my-3">
                    Informacion General:
                  </h2>
                  <div className="text-lg font-light flex flex-col">
                    <li className="flex">
                      <h3 className="font-bold">Nombre:</h3>
                      <p>{client.NombreCompleto}</p>
                    </li>
                    <li className="flex">
                      <h3 className="font-bold">Correo:</h3>
                      <p>{client.Correo}</p>
                    </li>
                    <li className="flex">
                      <h3 className="font-bold">NIT : </h3>
                      <p> {client.NumeroDocumento}</p>
                    </li>
                    <li className="flex">
                      <h3 className="font-bold">Telefono :</h3>
                      <p> {client.Telefono}</p>
                    </li>
                  </div>
                </div>
                {decodeToken()?.role === "Administrador" && (
                  <div className="h-full flex items-center justify-start mx-2">
                    <button className="text-black">
                      <VisibilityIcon fontSize="medium" />
                    </button>
                    <button className="text-blue-500">
                      <EditIcon fontSize="medium" />
                    </button>
                    <button className="text-red-500">
                      <DeleteIcon fontSize="medium" />
                    </button>
                  </div>
                )}
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
