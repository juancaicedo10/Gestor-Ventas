import React, { useEffect, useState } from "react";
import axios from "axios";
import decodeToken from "../tokenDecored";
import { toast } from "react-toastify";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  getClients: () => void;
}

const NuevoVendedorModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  getClients,
}) => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cedula, setCedula] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [direccion, setDireccion] = useState("");
  const [foto, setFoto] = useState<File | null>(null); // Cambiar a tipo File

  const [nombreValido, setNombreValido] = useState(true);
  const [correoValido, setCorreoValido] = useState(true);
  const [telefonoValido, setTelefonoValido] = useState(true);
  const [cedulaValido, setCedulaValido] = useState(true);
  const [contraseñaValido, setContraseñaValido] = useState(true);
  const [direccionValido, setDireccionValido] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;
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
      case "contraseña":
        setContraseña(value);
        setContraseñaValido(true);
        break;
      case "Foto":
        if (files && files.length > 0) {
          setFoto(files[0]); // Asignar el archivo seleccionado
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

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
    if (!contraseña) {
      setContraseñaValido(false);
      esValido = false;
    }
    if (!direccion) {
      setDireccionValido(false);
      esValido = false;
    }

    if (!esValido) return;

    const formData = new FormData();
    formData.append("NombreCompleto", nombre);
    formData.append("NumeroDocumento", cedula);
    formData.append("TipoDocumento", "1");
    formData.append("Telefono", telefono);
    formData.append("Correo", correo);
    formData.append("Contrasena", contraseña);
    formData.append("Direccion", direccion);
    if (foto) {
      formData.append("Foto", foto); // Agregar el archivo al FormData
    }
    formData.append("OficinaId", "1");

    axios
      .post("https://backendgestorventas1.azurewebsites.net/api/vendedores", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        console.log("Vendedor CREADO EXITOSAMENTE");
        setNombre("");
        setCorreo("");
        setTelefono("");
        setCedula("");
        setDireccion("");
        setNombreValido(true);
        setCorreoValido(true);
        setTelefonoValido(true);
        setCedulaValido(true);
        setDireccionValido(true);
        setContraseñaValido(true);
        setFoto(null);
        getClients();
        toast.success("Vendedor creado correctamente");
      })
      .catch((err) => {
        console.log(err)
        toast.error("Error creando el vendedor", err);
      });
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setNombre("");
      setCorreo("");
      setTelefono("");
      setCedula("");
      setDireccion("");
      setFoto(null);
      setNombreValido(true);
      setCorreoValido(true);
      setTelefonoValido(true);
      setCedulaValido(true);
      setContraseñaValido(true);
      setDireccionValido(true);
    }
  }, [isOpen]);

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
          encType="multipart/form-data"
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <header className="flex justify-between items-center mb-4">
              <h5 className="font-bold text-xl sm:text-xl md:text-lg xl:text-3xl text-blue-900">
                Nuevo Vendedor
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
            <div className="flex flex-col text-base md:text-lg font-normal mt-2">
              <label className="text-gray-700">Foto (opcional):</label>
              <span className="border border-gray rounded-md flex items-center justify-center h-[100px]">
                <input
                  type="file"
                  name="Foto"
                  onChange={handleChange}
                  placeholder="Selecciona foto"
                />
              </span>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              className="text-base sm:text-base md:text-lg lg:text-xl xl:text-2xl py-2 px-4 bg-blue-900 text-white rounded-lg hover:bg-blue-700 font-semibold w-full my-3 "
            >
              {decodeToken()?.user.role === "Administrador"
                ? "Crear Vendedor"
                : "Enviar vendedor a aprobacion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoVendedorModal;
