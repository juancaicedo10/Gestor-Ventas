import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { FormatearFecha } from "../../utils/FormatearFecha";


interface Props {
    isOpen: boolean;
    onClose: () => void;
    }


interface Notificacion {
    Fecha: string;
    NombreCliente: string;
    NombreVendedor: string;
    NumeroVenta: string;
    TipoId: number;
    TipoSeguimiento: string;
    Valor: number;
}

const Notificaciones: React.FC<Props> = ({ isOpen, onClose }) => {

    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
    
    
    const getNotificaciones = async () => {
        try {
            const response = await axios.get(
                "https://backendgestorventas.azurewebsites.net/api/notificaciones"
            );
            setNotificaciones(response.data);
        } catch (error) {
            console.error("Error al obtener las notificaciones", error);
        }
    }

    useEffect(() => {
        getNotificaciones();
    }, [isOpen]);

  return (
    <aside
      className={`z-50 fixed right-0 top-0 h-full bg-gray-100 transition-all duration-500 ease-in-out ${
        isOpen ? "w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/2" : "w-0"
      }`}
      style={{ overflowY: 'auto' }}
    >
      <header className="flex w-full">
        <button
          className={`flex items-center justify-center p-2 text-3xl text-blue-800 font-extrabold`}
            onClick={onClose}
        >
            <CloseIcon fontSize="large" className="relative left-0" />
        </button>
      </header>
      <ul className="text-xl md:text-2xl flex flex-col w-full p-2">
      {notificaciones.map((notificacion, index) => (
  <li key={index} className={ `bg-white rounded-2xl w-1/2 p-2 shadow-sm ${index % 2 !== 0 && 'ml-auto'}`}>
    <header className="w-full flex justify-between items-center my-auto">
      <h3 className="font-bold text-blue-800">{notificacion.TipoSeguimiento}</h3>
      <h3 className="text-base font-normal">{notificacion.NombreVendedor}</h3>
    </header>
    <p className="text-sm py-1">
  {notificacion.TipoId === 1 ? (
    <>
      se registró una venta por un valor de <span className="text-blue-600 font-semibold">{notificacion.Valor}$</span> para el cliente <span className="text-blue-600 font-semibold">
        {notificacion.NombreCliente}
        </span>
    </>
  ) : (
    <>
      se registró un abono por un valor de {notificacion.Valor}$ para la venta {notificacion.NumeroVenta}
    </>
  )}
</p>
    <footer className="w-full flex justify-between items-center text-base">
      <span>{FormatearFecha(notificacion.Fecha)}</span>
      <span>
        {
            new Date(notificacion.Fecha).toLocaleDateString()
        }
      </span>
    </footer>
  </li>
))}
      </ul>
    </aside>
  );
}

export default Notificaciones;
