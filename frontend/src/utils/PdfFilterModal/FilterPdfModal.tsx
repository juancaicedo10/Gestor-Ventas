import React from "react";
import { useState, useEffect } from "react";

import Spinner from "../Spinner";
import decodeToken from "../tokenDecored";
import HttpClient from "../../Services/httpService";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterPdfModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filtros, setFiltros] = useState<any[]>([]);

  useEffect(() => {
    // Llama a la API para obtener los filtros de ventas
    const fetchFiltros = async () => {
      setIsLoading(true);
      try {
        const response = await HttpClient.get(
          `${import.meta.env.VITE_API_URL}/api/filtros`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              isPdf: true,
            },
          }
        );
        await setFiltros(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar los filtros:", error);
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchFiltros();
    }
  }, [isOpen]);

  const handleButtonClick = (filtroId: number) => {
    downloadPdf(filtroId);
    onClose();
  };

  const downloadPdf = (filtroId: number) => {
    const Id = decodeToken()?.user.Id;
    let url =
      decodeToken()?.user.role === "Administrador"
        ? `${import.meta.env.VITE_API_URL}/api/ventas/pdf/all`
        : `${import.meta.env.VITE_API_URL}/api/ventas/pdf/${Id}`;
    HttpClient({
      url: url,
      params: {
        filtroId: filtroId,
      },
      method: "GET",
      responseType: "blob", // Importante para manejar archivos binarios como PDF
    })
      .then((res) => {
        // Crear una URL a partir de los datos del archivo
        const url = window.URL.createObjectURL(new Blob([res.data]));
        // Crear un enlace <a> temporal
        const link = document.createElement("a");
        link.href = url;
        // Asignar un nombre al archivo descargado
        link.setAttribute("download", "reporte-ventas.pdf");
        // Añadir el enlace al documento y hacer clic para descargar
        document.body.appendChild(link);
        link.click();
        // Limpiar el enlace después de la descarga
        document.body.removeChild(link);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const backgroundColor = [
    "bg-yellow-700",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-purple-500",
  ];

  return (
    <div>
      {isOpen && (
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
            <section className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <header className="flex w-full items-center justify-between">
                  <h3
                    className="text-3xl leading-6 font-bold text-primary"
                    id="modal-title"
                  >
                    Tipo de PDF
                  </h3>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-4xl text-gray-500 hover:text-gray-900"
                  >
                    &times;
                  </button>
                </header>
                <section className="w-full py-1 min-h-[40vh] flex flex-col items-center justify-between ">
                  {isLoading ? (
                    <section className="w-full min-h-[40vh] flex justify-center items-center">
                      <Spinner isLoading={isLoading} />
                    </section>
                  ) : (
                    <div className="flex flex-col justify-between items-center w-3/4 min-h-[35vh]">
                      {filtros.map((filtro) => (
                        <button
                          key={filtro.Id}
                          className={`w-full text-white font-bold text-xl md:text-2xl lg:text-3xl rounded-md transition-transform transform hover:scale-105 active:scale-95 active:shadow-inner ${
                            backgroundColor[filtro.Id - 1]
                          }`}
                          onClick={() => handleButtonClick(filtro.Id)}
                        >
                          <h6 className="text-xl md:text-2xl lg:text-3xl py-2">
                            {filtro.Nombre}
                          </h6>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPdfModal;
