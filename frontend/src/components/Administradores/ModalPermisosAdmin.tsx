import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../../utils/Spinner";
import HttpClient from "../../Services/httpService";
import PermisosCheckboxes from "./PermisosCheckboxes";

interface ModalProps {
  isOpen: boolean;
  Id: number;
  nombreAdmin: string;
  onClose: () => void;
}

const ModalPermisosAdmin: React.FC<ModalProps> = ({
  isOpen,
  Id,
  nombreAdmin,
  onClose,
}) => {
  const [permisos, setPermisos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getPermisos = async () => {
    try {
      setIsLoading(true);
      const response = await HttpClient.get(
        `${import.meta.env.VITE_API_URL}/api/administradores/${Id}/permisos`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPermisos(response.data);
    } catch (error) {
      console.error("Error obteniendo permisos:", error);
      toast.error("No se pudieron cargar los permisos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getPermisos();
    }
  }, [isOpen, Id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      await HttpClient.put(
        `${import.meta.env.VITE_API_URL}/api/administradores/${Id}/permisos`,
        { permisos },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Permisos actualizados correctamente");
      onClose();
    } catch (error) {
      console.error("Error guardando permisos:", error);
      toast.error("Error al guardar los permisos");
    } finally {
      setIsSaving(false);
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
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <header className="flex justify-between items-center mb-2">
              <div>
                <h5 className="font-bold text-xl sm:text-2xl text-primary">
                  Permisos de modulos
                </h5>
                <p className="text-sm text-gray-500 mt-1">{nombreAdmin}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-4xl text-gray-500 hover:text-gray-900 font-normal"
              >
                &times;
              </button>
            </header>

            {isLoading ? (
              <div className="flex justify-center items-center min-h-[280px]">
                <Spinner isLoading={isLoading} />
              </div>
            ) : (
              <PermisosCheckboxes
                selectedPermisos={permisos}
                onChange={setPermisos}
              />
            )}
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              disabled={isLoading || isSaving}
              className="text-base sm:text-lg py-2 px-4 bg-primary text-white rounded-lg hover:bg-tertiary font-semibold w-full my-3 disabled:opacity-60"
            >
              {isSaving ? "Guardando..." : "Guardar permisos"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPermisosAdmin;
