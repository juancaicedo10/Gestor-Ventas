import React, { useState } from 'react';
import axios from 'axios';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  getClients : () => void;
}

const NuevoVendedorModal: React.FC<ModalProps> = ({ isOpen, onClose, getClients }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cedula, setCedula] = useState('');
  const [contraseña, setContraseña] = useState('23232323');
  const [direccion, setDireccion] = useState('');
  const [oficinaId, setOficinaId] = useState(1);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'nombre') setNombre(event.target.value);
    if (event.target.name === 'correo') setCorreo(event.target.value);
    if (event.target.name === 'telefono') setTelefono(event.target.value);
    if (event.target.name === 'cedula') setCedula(event.target.value);
    if (event.target.name === 'direccion') setDireccion(event.target.value);
    if (event.target.name === 'contraseña') setContraseña(event.target.value);
    if (event.target.name === 'oficinaId') setOficinaId(parseInt(event.target.value));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

      try {
        axios.post('https://backendgestorventas.azurewebsites.net/api/vendedores', {
        "NombreCompleto": nombre,
        "NumeroDocumento": cedula,
        "TipoDocumento": 1,
        "Telefono": telefono,
        "Correo": correo,
        "Contraseña": contraseña,
        "Direccion": direccion,
        "OficinaId": oficinaId
        }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(() => {
        console.log("Vendedor CREADO EXITOSAMENTE")
      getClients();
      })
      .catch((err) => console.log(err));
      } catch (error) {
        console.error('Error al crear el vendedor:', error);
      }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full w-full md:w-1/2 lg:w-1/3 md:translate-y-[25%]">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <form onSubmit={handleSubmit} className="space-y-2 text-lg font-normal">
              <header className='flex justify-between items-center'>
              <h5 className='font-bold text-xl sm:text-xl md:text-lg xl:text-3xl text-blue-900 '>Nuevo Vendedor</h5>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-4xl text-gray-500 hover:text-gray-900"
                >
                  &times;
                </button>
              </header>
              <label className="block">
                <span className="text-gray-700">Nombre:</span>
                <input type="text" name="nombre" value={nombre} onChange={handleChange} className="mt-1 block w-full rounded-md shadow-sm border border-black py-2 text-sm" />
              </label>
               <label className="block">
                <span className="text-gray-700">Telefono:</span>
                <input type="phone" name="telefono" value={telefono} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm py-1 text-sm" />
              </label>
              <label className="block">
                <span className="text-gray-700">Correo:</span>
                <input type="email" name="correo" value={correo} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm py-1 text-sm" />
              </label>
              <label className="block">
                <span className="text-gray-700">Cedula:</span>
                <input type="text" name="cedula" value={cedula} onChange={handleChange} className="mt-1 block w-full rounded-md border border-black shadow-sm py-1" />
              </label>
              <label className="block">
                <span className="text-gray-700">Direccion:</span>
                <input type="text" name="direccion" value={direccion} onChange={handleChange} className="text-base mt-1 block w-full rounded-md border border-black shadow-sm py-1" />
              </label>
            
              <button type="submit" className="text-base sm:text-base md:text-lg lg:text-xl xl:text-2xl py-2 px-4 bg-blue-900 text-white rounded-lg hover:bg-blue-700 font-semibold w-full my-3 ">
                Crear Vendedor            
                </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevoVendedorModal;