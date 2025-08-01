import React, { useEffect, useState } from "react";

import Spinner from "../Spinner";
import HttpClient from "../../Services/httpService";
import FileInputWithPreview from "../Fotos/FileInputWithPreview";

interface ModalProps {
  isOpen: boolean;
  Id: number;
  onClose: () => void;
  getVendedores: () => void;
}

const ModificarVendedorModal: React.FC<ModalProps> = ({
  isOpen,
  Id,
  getVendedores,
  onClose,
}) => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cedula, setCedula] = useState("");
  const [direccion, setDireccion] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [oficinaId, setOficinaId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [foto, setFoto] = useState<null | string | File>(null);

  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const [nombreValido, setNombreValido] = useState(true);
  const [correoValido, setCorreoValido] = useState(true);
  const [telefonoValido, setTelefonoValido] = useState(true);
  const [cedulaValido, setCedulaValido] = useState(true);
  const [contraseñaValido, setContraseñaValido] = useState(true);
  const [direccionValido, setDireccionValido] = useState(true);

  const getVendedor = async () => {
    try {
      setIsLoading(true);
      await HttpClient.get(
        `${import.meta.env.VITE_API_URL}/api/vendedores/${Id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((response) => {
        setNombre(response.data.NombreCompleto);
        setCorreo(response.data.Correo);
        setTelefono(response.data.Telefono);
        setCedula(response.data.NumeroDocumento);
        setDireccion(response.data.Direccion);
        setContraseña(response.data.Contraseña);
        setFoto(response.data.Foto);
        setOficinaId(response.data.OficinaId);
        setIsLoading(false);
        console.log(response.data);
      });
    } catch (error) {
      console.error("Error obteniendo cliente:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getVendedor();
    }
  }, [isOpen]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "nombre") {
      setNombre(event.target.value);
      setNombreValido(true);
    }
    if (event.target.name === "correo") {
      setCorreo(event.target.value);
      setCorreoValido(true);
    }
    if (event.target.name === "telefono") {
      setTelefono(event.target.value);
      setTelefonoValido(true);
    }
    if (event.target.name === "cedula") {
      setCedula(event.target.value);
      setCedulaValido(true);
    }
    if (event.target.name === "direccion") {
      setDireccion(event.target.value);
      setDireccionValido(true);
    }
    if (event.target.name === "contraseña") {
      setContraseña(event.target.value);
      setContraseñaValido(true);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoadingButton(true);

    let esValido = true;
    if (!nombre) {
      setNombreValido(false);
      esValido = false;
    }
    if (!correo) {
      setCorreoValido(false);
      esValido = false;
    }
    if (!telefono) {
      setTelefonoValido(false);
      esValido = false;
    }
    if (!cedula) {
      setCedulaValido(false);
      esValido = false;
    }
    if (!direccion) {
      setDireccionValido(false);
      esValido = false;
    }
    if (!contraseña) {
      setContraseñaValido(false);
      esValido = false;
    }

    if (!esValido) {
      setIsLoadingButton(false);
      return;
    }

    const formData = new FormData();

    formData.append("NombreCompleto", nombre);
    formData.append("NumeroDocumento", cedula);
    formData.append("TipoDocumento", "1");
    formData.append("Telefono", telefono);
    formData.append("Correo", correo);
    formData.append("Direccion", direccion);
    formData.append("Contrasena", contraseña);
    formData.append("OficinaId", oficinaId.toString());
    if (foto) {
      if (typeof foto === "string") {
        formData.append("Foto", foto);
      } else {
        formData.append("Foto", foto);
      }
    }

    try {
      HttpClient.putForm(
        `${import.meta.env.VITE_API_URL}/api/vendedores/${Id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then(() => {
        console.log("CLIENTE CREADO EXITOSAMENTE");
        getVendedores();
        setIsLoadingButton(false);
        onClose();
      });
    } catch (error) {
      console.error("Error creando cliente:", error);
      setIsLoadingButton(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <form
          onSubmit={handleSubmit}
          action="submit"
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"
        >
          {" "}
          <section
            className={`${
              isLoading &&
              "w-full flex justify-center items-center min-h-[420px]"
            }`}
          >
            {isLoading ? (
              <Spinner isLoading={isLoading} />
            ) : (
              <>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <header className="flex justify-between items-center">
                    <h5 className="font-bold text-xl sm:text-xl md:text-lg xl:text-3xl text-primary ">
                      Modificar Vendedor
                    </h5>
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-4xl text-gray-500 hover:text-gray-900 font-normal"
                    >
                      &times;
                    </button>
                  </header>
                  <label className="block text-base md:text-lg font-normal mb-2">
                    <span className="text-gray-600">Nombre:</span>
                    <input
                      type="text"
                      name="nombre"
                      value={nombre}
                      onChange={handleChange}
                      className={`p-2 rounded-md border w-full text-sm ${
                        !nombreValido ? "border-red-500" : ""
                      }`}
                      placeholder="Nombre del vendedor"
                    />
                    {!nombreValido && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </label>
                  <label className="block text-base md:text-lg font-normal mb-2">
                    <span className="text-gray-700">Telefono:</span>
                    <input
                      type="phone"
                      name="telefono"
                      value={telefono}
                      onChange={handleChange}
                      className={`p-2 rounded-md border w-full text-sm ${
                        !telefonoValido ? "border-red-500" : ""
                      }`}
                      placeholder="+57 1234567890"
                    />
                    {!telefonoValido && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </label>
                  <label className="block text-base md:text-lg font-normal mb-2">
                    <span className="text-gray-700">Correo:</span>
                    <input
                      type="email"
                      name="correo"
                      value={correo}
                      onChange={handleChange}
                      className={`p-2 rounded-md border w-full text-sm ${
                        !correoValido ? "border-red-500" : ""
                      }`}
                      placeholder="correofalso@gmail.com"
                    />
                    {!correoValido && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </label>
                  <label className="block  text-base md:text-lg font-normal mb-2">
                    <span className="text-gray-700">Cedula:</span>
                    <input
                      type="text"
                      name="cedula"
                      value={cedula}
                      onChange={handleChange}
                      className={`p-2 rounded-md border w-full text-sm ${
                        !cedulaValido ? "border-red-500" : ""
                      }`}
                      placeholder="1234567890"
                    />
                    {!cedulaValido && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </label>
                  <label className="block text-base md:text-lg font-normal mb-2">
                    <span className="text-gray-700">Contraseña:</span>
                    <input
                      type="password"
                      name="contraseña"
                      value={contraseña}
                      onChange={handleChange}
                      className={`p-2 rounded-md border w-full text-sm ${
                        !contraseñaValido ? "border-red-500" : ""
                      }`}
                      placeholder="********"
                    />
                    {!contraseñaValido && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </label>
                  <label className="block text-base md:text-lg font-normal">
                    <span className="text-gray-700">Direccion:</span>
                    <input
                      type="text"
                      name="direccion"
                      value={direccion}
                      onChange={handleChange}
                      className={`p-2 rounded-md border w-full text-sm ${
                        !direccionValido ? "border-red-500" : ""
                      }`}
                      placeholder="Calle 123 # 123-123"
                    />
                    {!direccionValido && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </label>
                  <label className="block text-base md:text-lg font-normal mt-2">
                    <span className="text-gray-700">Foto (opcional):</span>
                    <FileInputWithPreview
                      file={foto as string}
                      onFileSelected={(e) => setFoto(e)}
                    ></FileInputWithPreview>
                  </label>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fifth sm:ml-3 sm:w-auto sm:text-sm"
                    disabled={isLoadingButton}
                  >
                    {isLoadingButton ? (
                      <div
                        className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                        role="status"
                      ></div>
                    ) : (
                      "Modificar Vendedor"
                    )}
                  </button>
                </div>
              </>
            )}
          </section>
        </form>
      </div>
    </div>
  );
};

export default ModificarVendedorModal;
