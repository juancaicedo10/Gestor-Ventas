import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import decodeToken from "../../utils/tokenDecored";
import Select from "react-select";
import Spinner from "../../utils/Spinner";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RelacionAdministradorVendedorModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
}) => {

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [adminSelected, setAdminSelected] = useState<number>(0);

  const [vendedoresSeleccionados, setVendedoresSeleccionados] = useState<
    number[]
  >([]);

  const [vendedores, setVendedores] = useState<any[]>([]);

  const [administradores, setAdministradores] = useState<any[]>([]);

  const handleSelectSeller = (seleccionado: number) => {
    setIsLoading(true);
    setAdminSelected(seleccionado);
    axios
      .get(`https://backendgestorventas.azurewebsites.net/api/administradores/relacion/${seleccionado}`)
      .then((res) => {
        setVendedores(res.data);

        // Filtra los vendedores que ya están seleccionados
        const seleccionadosIniciales = res.data
          .filter((vendedor: any) => vendedor.Seleccionado === 1)
          .map((vendedor: any) => vendedor.VendedorId);

        // Actualiza el estado con los vendedores seleccionados
        setVendedoresSeleccionados(seleccionadosIniciales);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const getAdministradores = async () => {
    try {
      const res = await axios.get(
        "https://backendgestorventas.azurewebsites.net/api/administradores"
      );
      setAdministradores(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    console.log("vendedoresSeleccionados", vendedoresSeleccionados);

    axios
      .post("https://backendgestorventas.azurewebsites.net/api/administradores/relacion", {
        AdministradorId: adminSelected,
        Vendedores: vendedoresSeleccionados,
      })
      .then((res) => {
        console.log(res);
        toast.success("Relación guardada correctamente");
        onClose();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Ocurrió un error al guardar la relación");
      });
  };

  const adminOptions = administradores.map((admin) => {
    return {
      value: admin.Id,
      label: admin.NombreCompleto,
    };
  });

  const handleVendedorChange = (vendedorId: number, seleccionado: boolean) => {
    if (seleccionado) {
      console.log("vendedorId", vendedorId);
      // Agregar el vendedor a la lista de seleccionados
      setVendedoresSeleccionados((prev) => [...prev, vendedorId]);
    } else {
      console.log("vendedorId", vendedorId);
      // Remove el vendedor de la lista de seleccionados
      setVendedoresSeleccionados((prev) =>
        prev.filter((id) => id !== vendedorId)
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      getAdministradores();
      setAdminSelected(0);
      setVendedoresSeleccionados([]);
      setVendedores([]);
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
                Relacion Administrador - Vendedor
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
              <span className="text-gray-600">Administrador:</span>
              <Select
                id="admin"
                options={adminOptions}
                placeholder="Seleccione un administrador"
                onChange={(selectedOption) =>
                  handleSelectSeller(selectedOption?.value)
                }
                isSearchable
                isDisabled={decodeToken()?.user?.role === "Vendedor"}
                maxMenuHeight={170}
                menuPlacement="auto"
                className="w-full mb-2"
              />
            </label>
            <div className="min-h-[400px]">
              {isLoading ? (
                <div className="w-full h-[400px] flex items-center justify-center">
                  <Spinner isLoading={true} />
                </div>
              ) : (
                vendedores.map((vendedor) => (
                  <div
                    key={vendedor.id}
                    className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg mb-4 hover:bg-gray-100 transition duration-300 ease-in-out"
                  >
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="vendedor"
                        value={vendedor.VendedorId}
                        checked={vendedoresSeleccionados.includes(
                          vendedor.VendedorId
                        )}
                        onChange={(e) =>
                          handleVendedorChange(
                            vendedor.VendedorId,
                            e.target.checked
                          )
                        }
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span className="text-gray-800 text-lg font-normal">
                        {vendedor.NombreCompleto}
                      </span>
                    </label>
                  </div>
                ))
              )}
            </div>
            <button
              type="submit"
              className="text-base sm:text-base md:text-lg lg:text-xl xl:text-2xl py-2 px-4 bg-blue-900 text-white rounded-lg hover:bg-blue-700 font-semibold w-full my-3 "
            >
              {decodeToken()?.user.role === "Administrador" &&
                "Guardar Relacion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RelacionAdministradorVendedorModal;
