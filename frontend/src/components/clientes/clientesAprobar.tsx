import Sidebar from "../Sidebar";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import { useState, useEffect } from "react";
import Spinner from "../../utils/Spinner";
import ClientsImage from '../../images/clients.png';

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
        <h1 className="mb-2 py-4 text-2xl text-blue-900 md:text-4xl lg:text-5xl text-center border-b shadow-md bg-gray-50 w-full">
          Clientes por aprobar
        </h1>
        <section className={`${isLoading && 'flex items-center justify-center'} h-dvh`}>
          {isLoading ?  <Spinner isLoading={isLoading}/> : (
            clientsToApprove.length === 0 ? 
            <div className="flex items-center flex-col justify-center w-full h-full">
              <img src={ClientsImage} alt="clientes image" />
              <h1 className="w-full md:w-1/2 text-center font-extrabold text-3xl md:text-4xl lg:text-6xl text-blue-900">En este momento no hay ningun cliente por aprobar</h1> 
            </div>
              : (
                <ul className="flex flex-col items-start w-full px-2">
                  {clientsToApprove.map((client) => (
                    <li key={client.Id} className="flex items-center justify-between w-full p-2 my-2 bg-gray-100 shadow-md">
                      <div className="flex items-center">
                        <PersonIcon />
                        <p className="ml-2">{client.NombreCompleto}</p>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => HandleApprove(client.Id, { aprobado: true })}
                          className="bg-green-500 text-white p-2 rounded-md"
                        >
                          <CheckIcon />
                        </button>
                        <button
                          onClick={() => HandleApprove(client.Id, { aprobado: false })}
                          className="bg-red-500 text-white p-2 rounded-md"
                        >
                          <CloseIcon />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )
          )}
        </section>
      </div>
    </section>
    );
}

export default clientesAprobar;
