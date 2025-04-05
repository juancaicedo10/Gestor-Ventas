import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../Spinner";
import { toast } from "react-toastify";

interface ModalProps {
  isOpen: boolean;
  Id: number;
  onClose: () => void;
  getClients: () => void;
}

const ModificarClienteModal: React.FC<ModalProps> = ({
  isOpen,
  Id,
  getClients,
  onClose,
}) => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cedula, setCedula] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ocupacion, setOcupacion] = useState("");
  const [detalle, setDetalle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const [nombreValido, setNombreValido] = useState(true);
  const [correoValido, setCorreoValido] = useState(true);
  const [telefonoValido, setTelefonoValido] = useState(true);
  const [cedulaValido, setCedulaValido] = useState(true);
  const [direccionValido, setDireccionValido] = useState(true);
  const [ocupacionValido, setOcupacionValido] = useState(true);
  const [detalleValido, setDetalleValido] = useState(true);

  const getClient = async () => {
    try {
      setIsLoading(true);
      await axios
        .get(
          `${import.meta.env.VITE_API_URL}/api/clientes/${Id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          setNombre(response.data.NombreCompleto);
          setCorreo(response.data.Correo);
          setTelefono(response.data.Telefono);
          setCedula(response.data.NumeroDocumento);
          setDireccion(response.data.Direccion);
          setOcupacion(response.data.Ocupacion);
          setDetalle(response.data.Detalle);
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
      getClient();
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
    if (event.target.name === "ocupacion") {
      setOcupacion(event.target.value);
      setOcupacionValido(true);
    }
    if (event.target.name === "detalle") {
      setDetalle(event.target.value);
      setDetalleValido(true);
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

    if (!ocupacion) {
      setOcupacionValido(false);
      esValido = false;
    }

    if (!detalle) {
      setDetalleValido(false);
      esValido = false;
    }

    if (!esValido) {
      setIsLoadingButton(false);
      return;
    }

    try {
      axios
        .put(
          `${import.meta.env.VITE_API_URL}/api/clientes/${Id}`,
          {
            NombreCompleto: nombre,
            NumeroDocumento: cedula,
            TipoDocumento: 1,
            Telefono: telefono,
            Correo: correo,
            Direccion: direccion,
            Ocupacion: ocupacion,
            Detalle: detalle,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          setIsLoadingButton(false);
          getClients();
          onClose();
          toast.success("Cliente modificado correctamente");
        });
    } catch (error) {
      setIsLoadingButton(false);
      onClose();
      toast.error("Error al modificar el cliente");
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
                    <h5 className="font-bold text-xl sm:text-xl md:text-lg xl:text-3xl text-blue-900 ">
                      Modificar Cliente
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
                  <label className="block text-base md:text-lg font-normal">
                    <span className="text-gray-700">Ocupacion:</span>
                    <input
                      type="text"
                      name="ocupacion"
                      value={ocupacion}
                      onChange={handleChange}
                      className={`p-2 rounded-md border w-full text-sm ${
                        !ocupacionValido ? "border-red-500" : ""
                      }`}
                      placeholder="Carpintero"
                    />
                    {!ocupacionValido && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </label>
                  <label className="block text-base md:text-lg font-normal">
                    <span className="text-gray-700">Detalle:</span>
                    <input
                      type="text"
                      name="detalle"
                      value={detalle}
                      onChange={handleChange}
                      className={`p-2 rounded-md border w-full text-sm ${
                        !detalleValido ? "border-red-500" : ""
                      }`}
                      placeholder="Trabaja en..."
                    />
                    {!detalleValido && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </label>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-900 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    disabled={isLoadingButton}
                  >
                    {isLoadingButton ? (
                      <div
                        className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                        role="status"
                      ></div>
                    ) : (
                      "Modificar Cliente"
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

export default ModificarClienteModal;
