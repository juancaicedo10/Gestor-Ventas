import Sidebar from "../Sidebar";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import { useState, useEffect } from "react";

function clientesAprobar() {
    interface ClientToApprove {
        Id: number;
        NombreCompleto: string;
        Correo: string;
        NumeroDocumento: string;
        Telefono: string;
    }
    
    const [clientsToApprove, setClientsToApprove] = useState<ClientToApprove[]>([]);
    const [refresh, setRefresh] = useState(false);

useEffect(() => {
    axios
        .get("http://localhost:5000/api/clientes/aprobar", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res) => setClientsToApprove(res.data))
        .catch((err) => console.log(err));
}, [refresh]);

const HandleApprove = async (id: number, approval : {aprobado: boolean}) => {
    try {
        await axios.put(`http://localhost:5000/api/clientes/aprobar/${id}`, approval, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        setRefresh(!refresh); // Esto actualizará el estado refresh, lo que a su vez activará el useEffect
    } catch (error) {
        console.error("Error al aprobar cliente", error);
    }
};

  return (
    <section>
      <Sidebar />
      <div className="flex flex-col justify-center text-3xl font-bold ml-[80px]">
        <h1 className="my-2 text-2xl md:text-4xl lg:text-6xl text-start border-b-2 py-2 border-green-400 w-full">
          Clientes por aprobar
        </h1>
        <ul className="flex flex-col items-start w-full">
            {clientsToApprove.map((client) => (
                <li className="w-11/12 flex items-center justify-between py-4 my-2 rounded-md border-2">
                <div className="flex items-center">
                  <PersonIcon fontSize="large" />
                  <h2 className="text-xl font-normal">{ client.NombreCompleto }</h2>
                </div>
                <div className="flex items-center">
                  <button className="text-green-500 bg-green-300 rounded-md border-2 border-green-500 mx-2"  onClick={() => HandleApprove(client.Id, {aprobado: true})}>
                    <CheckIcon fontSize="large" />
                  </button>
                  <button className="text-red-500 bg-red-300 rounded-md border-2 border-red-500 mx-2" onClick={() => HandleApprove(client.Id, {aprobado: false})}>
                    <CloseIcon fontSize="large" />
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}

export default clientesAprobar;