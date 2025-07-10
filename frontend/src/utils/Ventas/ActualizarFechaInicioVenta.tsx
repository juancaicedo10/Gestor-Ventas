import { useState } from "react";
import HttpClient from "../../Services/httpService";
import { formatDate } from "../Helpers/FormatDate";
import { toast } from "react-toastify";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;

  ventaSelected: any;
  newFechaInicio?: string;
  onFechaUpdate: (fecha: string) => void;
}

const ActualizarFechaInicioVenta: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  ventaSelected,
  onFechaUpdate
}) => {
  //====== HOOKS  ======//
  const [newFechaInicio, setNewFechaInicio] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //====== ACTIONS ======//

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { Id: ventaId } = ventaSelected;

    setIsLoading(true);

    try {
      await HttpClient.put(`${import.meta.env.VITE_API_URL}/api/ventas/fecha-inicio`, {
        VentaId: ventaId,
        Fecha: newFechaInicio,
      });
      setIsLoading(false);

      onFechaUpdate(newFechaInicio);



      toast.success("Fecha de inicio actualizada correctamente");
    } catch (error) {
      setIsLoading(false);

      toast.error("Error al actualizar la fecha de inicio");
    } finally {
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();

    setNewFechaInicio("");
  };

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
            <form
              action="submit"
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onSubmit={(e) => handleSave(e)}
            >
              {" "}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <header className="flex w-full items-center justify-between">
                  <h3
                    className="text-3xl leading-6 font-bold text-primary"
                    id="modal-title"
                  >
                    Modificar Fecha Inicio
                  </h3>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-4xl text-gray-500 hover:text-gray-900"
                  >
                    &times;
                  </button>
                </header>
                <div className="mt-4 w-full mb-2">
                  <label htmlFor="seller">Fecha Actual:</label>
                  <input
                    type="text"
                    id="seller"
                    name="seller"
                    value={formatDate(ventaSelected?.FechaInicio)}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div className="mt-4 w-full mb-2">
                  <label htmlFor="seller">Nueva Fecha:</label>
                  <input
                    type="date"
                    id="newFechaInicio"
                    name="newFechaInicio"
                    value={newFechaInicio}
                    onChange={(e) => setNewFechaInicio(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fifth sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {isLoading && (
                    <div
                      className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                      role="status"
                    ></div>
                  )}
                  Actualizar Fecha Inicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActualizarFechaInicioVenta;
