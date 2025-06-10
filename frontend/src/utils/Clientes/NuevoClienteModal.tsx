import React, { useEffect, useState } from "react";
import axios from "axios";
import decodeToken from "../tokenDecored";
import { toast } from "react-toastify";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  getClients: () => void;
}

const NuevoClienteModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  getClients,
}) => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cedula, setCedula] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ocupacion, setOcupacion] = useState("");
  const [detalle, setDetalle] = useState("");

  const [nombreValido, setNombreValido] = useState(true);
  const [correoValido, setCorreoValido] = useState(true);
  const [telefonoValido, setTelefonoValido] = useState(true);
  const [cedulaValido, setCedulaValido] = useState(true);
  const [direccionValido, setDireccionValido] = useState(true);
  const [ocupacionValido, setOcupacionValido] = useState(true);
  const [detalleValido, setDetalleValido] = useState(true);

  const [isDisabled, setIsDisabled] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case "nombre":
        setNombre(value);
        setNombreValido(true);
        break;
      case "correo":
        setCorreo(value);
        setCorreoValido(true);
        break;
      case "telefono":
        setTelefono(value);
        setTelefonoValido(true);
        break;
      case "cedula":
        setCedula(value);
        setCedulaValido(true);
        break;
      case "direccion":
        setDireccion(value);
        setDireccionValido(true);
        break;
      case "ocupacion":
        setOcupacion(value);
        setOcupacionValido(true);
        break;
      case "detalle":
        setDetalle(value);
        setDetalleValido(true);
        break;
      default:
        break;
  };
}

  const handleSubmit = (event: React.FormEvent) => {
    console.log("handleSubmit", isDisabled);
    event.preventDefault();

    setIsDisabled(true);

    let esValido = true;
    if (!nombre) { setNombreValido(false); esValido = false; }
    if (!correo) { setCorreoValido(false); esValido = false; }
    if (!telefono) { setTelefonoValido(false); esValido = false; }
    if (!cedula) { setCedulaValido(false); esValido = false; }
    if (!direccion) { setDireccionValido(false); esValido = false; }
    if (!ocupacion) { setOcupacionValido(false); esValido = false; }
    if (!detalle) { setDetalleValido(false); esValido = false; }

    if (!esValido) {
      setIsDisabled(false);
      return;
    }

    console.log('ocupacion: ', ocupacion)
    console.log('detalle: ', detalle)

    try {
      axios
        .post(
          "https://backendgestorventas1.azurewebsites.net/api/clientes",
          {
            NombreCompleto: nombre,
            NumeroDocumento: cedula,
            TipoDocumento: 1,
            Telefono: telefono,
            Correo: correo,
            Contraseña: "12121212",
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
          console.log("CLIENTE CREADO EXITOSAMENTE");
          setNombre("");
          setCorreo("");
          setTelefono("");
          setCedula("");
          setDireccion("");
          setOcupacion("");
          setDetalle("");
          setNombreValido(true);
          setCorreoValido(true);
          setTelefonoValido(true);
          setCedulaValido(true);
          setDireccionValido(true);
          setOcupacionValido(true);
          setDetalleValido(true);
          getClients();
          setIsDisabled(false);
          toast.success(decodeToken()?.user.role === "Administrador" ? "Cliente creado exitosamente" : "Cliente enviado a aprobacion");
        })
        .catch((err) => {
          console.log(err)
          setIsDisabled(false);
        });
    } catch (error) {
      console.error("Error creando cliente:", error);
      toast.error("Error creando cliente");
      setIsDisabled(false);
    }
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setNombre("");
      setCorreo("");
      setTelefono("");
      setCedula("");
      setDireccion("");
      setOcupacion("");
      setDetalle("");
      setNombreValido(true);
      setCorreoValido(true);
      setTelefonoValido(true);
      setCedulaValido(true);
      setDireccionValido(true);
      setOcupacionValido(true);
      setDetalleValido(true);
  }
}, [isOpen])

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div
        className="fixed inset-0 transition-opacity"
        aria-hidden="true"
      >
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
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <header className="flex justify-between items-center mb-4">
                <h5 className="font-bold text-xl sm:text-xl md:text-lg xl:text-3xl text-blue-900">
                  Nuevo Cliente
                </h5>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-4xl font-normal text-gray-500 hover:text-gray-900"
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
                  placeholder="Nombre del cliente"
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
              <label className="block text-base md:text-lg font-normal mt-2">
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
              <label className="block text-base md:text-lg font-normal mt-2">
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
                className="text-base sm:text-base md:text-lg lg:text-xl xl:text-2xl py-2 px-4 bg-blue-900 text-white rounded-lg hover:bg-blue-700 font-semibold w-full my-3 "
                disabled={isDisabled}
              >
                {decodeToken()?.user.role === "Administrador"
                  ? "Crear Cliente"
                  : "Enviar Cliente a aprobacion"}
              </button>
            </div>
            </form>
          </div>
        </div>
  );
};

export default NuevoClienteModal;
