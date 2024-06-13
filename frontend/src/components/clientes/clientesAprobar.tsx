import Sidebar from "../Sidebar";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import { useState, useEffect } from "react";
import Spinner from "../../utils/Spinner";

function clientesAprobar() {
  interface ClientToApprove {
    Id: number;
    NombreCompleto: string;
    Correo: string;
    NumeroDocumento: string;
    Telefono: string;
  }

  const [clientsToApprove, setClientsToApprove] = useState<ClientToApprove[]>(
    []
  );
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        "https://backendgestorventas.azurewebsites.net/api/clientes/aprobar",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {setClientsToApprove(res.data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setIsLoading(false)
      });
  }, [refresh]);

  const HandleApprove = async (id: number, approval: { aprobado: boolean }) => {
    try {
      await axios.put(
        `http://localhost:5000/api/clientes/aprobar/${id}`,
        approval,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRefresh(!refresh); // Esto actualizará el estado refresh, lo que a su vez activará el useEffect
    } catch (error) {
      console.error("Error al aprobar cliente", error);
    }
  };

  return (
    <section className="w-full">
      <Sidebar />
      <div className="flex flex-col justify-center text-3xl font-bold ml-[64px]">
        <h1 className="mb-2 py-4 text-3xl text-blue-900 md:text-4xl lg:text-5xl text-center border-b shadow-md bg-gray-50 w-full">
          Clientes por aprobar
        </h1>
      <section className={`${isLoading && 'flex items-center justify-center'} h-dvh`}>
      {isLoading ?  <Spinner isLoading={isLoading}/> : (
        <ul className="flex flex-col items-start w-full px-2">
          {clientsToApprove.map((client) => (
            <li
              className="w-full flex items-center justify-between py-4 my-2 rounded-md border-2 transform transition duration-500 ease-in-out hover:scale-x-105 bg-white"
              key={client.Id}
            >
              <div className="flex items-center">
                <PersonIcon fontSize="large" />
                <h2 className="text-xl font-normal">{client.NombreCompleto}</h2>
              </div>
              <div className="flex items-center">
                <button
                  className="text-green-500 bg-green-300 rounded-md border-2 border-green-500 mx-2"
                  onClick={() => HandleApprove(client.Id, { aprobado: true })}
                >
                  <CheckIcon fontSize="large" />
                </button>
                <button
                  className="text-red-500 bg-red-300 rounded-md border-2 border-red-500 mx-2"
                  onClick={() => HandleApprove(client.Id, { aprobado: false })}
                >
                  <CloseIcon fontSize="large" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        )}
      </section>
      </div>
    </section>
  );
}

export default clientesAprobar;
