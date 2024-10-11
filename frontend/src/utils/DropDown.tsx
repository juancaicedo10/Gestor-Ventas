import { useState } from 'react';
import EditNoteIcon from '@mui/icons-material/EditNote';
import axios from 'axios';
import ModificarClienteModal from './Clientes/ModificarClienteModal';

interface Props {
  Id: number;
  getClients:() => void
  onEdit: () => void;
}

const Dropdown = ( { Id, getClients, onEdit  } : Props ) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (e: any) => {
    e.preventDefault();
    try {
      axios.delete(`https://backend-gestor-ventas.onrender.com/api/clientes/${Id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(() => {
        console.log("CLIENTE ELIMINADO EXITOSAMENTE")
      getClients();
      })
      .catch((err) => console.log(err));
    } catch (error) {
      console.log("Error eliminando cliente: ", error);
    }
  }

  const handeEdit = () => {
    onEdit();
    ModificarClienteModal;
  }

  return (
    <div className="relative inline-block text-left">
      <div>
        <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm p-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" id="options-menu" aria-haspopup="true" aria-expanded="true" onClick={() => setIsOpen(!isOpen)}>
          <EditNoteIcon fontSize='medium'/>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-50 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button className="block px-4 py-2 text-sm text-gray-700 font-normal hover:bg-gray-200 hover:text-gray-900 w-full" onClick={handeEdit}>Modificar</button>
            <button className="block px-4 py-2 text-sm text-gray-700 font-normal hover:bg-gray-200 hover:text-gray-900 w-full" onClick={handleDelete}>Eliminar</button>
            <button className="block px-4 py-2 text-sm text-gray-700 font-normal hover:bg-gray-200 hover:text-gray-900 w-full" >Compras</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;