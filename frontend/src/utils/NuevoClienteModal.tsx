import React, { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NuevoClienteModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'nombre') setNombre(event.target.value);
    if (event.target.name === 'correo') setCorreo(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ nombre, correo });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="inline-block align-bottom bg-white ml-[64px] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Nombre:</span>
                <input type="text" name="nombre" value={nombre} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </label>
              <label className="block">
                <span className="text-gray-700">Correo:</span>
                <input type="email" name="correo" value={correo} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </label>
              <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevoClienteModal;