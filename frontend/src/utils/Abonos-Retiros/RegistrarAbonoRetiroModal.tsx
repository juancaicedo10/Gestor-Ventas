import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  getGastos: () => void;
  selectedVendedor: number | undefined;
  setSelectedVendedor: (value: number | undefined) => void;
}

const RegistrarAbonoRetiroModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  getGastos,
  selectedVendedor,
  setSelectedVendedor,
}) => {
  const [monto, setMonto] = useState<number>(0);
  const [descripcion, setDescripcion] = useState<string>("");
  const [selectedTipo, setSelectedTipo] = useState<string | undefined>("");
  const [selectedSeller, setSelectedSeller] = useState<number | undefined>(0);
  const [vendedores, setVendedores] = useState([]);
  const [isMontoValid, setIsMontoValid] = useState<boolean>(false);
  const [isDescripcionValid, setIsDescripcionValid] = useState<boolean>(false);
  const [isSellerValid, setIsSellerValid] = useState<boolean>(false);
  const [isTipoValid, setIsTipoValid] = useState<boolean>(false);

  console.log(selectedSeller);

  const Tipos = [
    {
      value: "Abono",
      label: "Abono",
    },
    {
      value: "Retiro",
      label: "Retiro",
    },
  ];

  const getVendedores = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/vendedores",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setVendedores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getVendedores();
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    let isValid = true;

    if (!monto) {
      isValid = false;
      setIsMontoValid(false);
    }
    if (!descripcion) {
      isValid = false;
      setIsDescripcionValid(false);
    }

    if (!selectedTipo || selectedTipo === "") {
      isValid = false;
      setIsTipoValid(false);
    }

    if (selectedSeller === 0 || !selectedSeller) {
      isValid = false;
      setIsSellerValid(false);
    }

    if (!isValid) return;

    const AbonoRetiro = {
      Valor: monto,
      VendedorId: selectedSeller,
      Descripcion: descripcion,
    };

    axios
      .post(
        `http://localhost:5000/api/${
          selectedTipo === "Abono" ? "abonos" : "retiros"
        }`,
        AbonoRetiro,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        console.log("Venta CREADA EXITOSAMENTE");
        getGastos();
        setSelectedVendedor(selectedVendedor);
        onClose();
      })
      .catch((err) => {
        console.log(err);
        onClose();
      });
  };

  useEffect(() => {
    if (!isOpen) {
      setMonto(0);
      setDescripcion("");
      setIsMontoValid(true);
      setIsDescripcionValid(true);
      setSelectedSeller(0);
      setSelectedTipo("");
      setIsSellerValid(true);
      setIsTipoValid(true);
    }
  }, [isOpen]);

  const SellersOptions = vendedores.map((seller: any) => ({
    value: seller.Id,
    label: seller.NombreCompleto,
  }));

  const TiposOptions = Tipos.map((seller) => ({
    value: seller.value,
    label: seller.label,
  }));

  const handleSelectTipo = (TipoId: string | undefined) => {
    if (TipoId !== null) {
      setIsTipoValid(true);
      setSelectedTipo(TipoId);
    }
  };

  const handleSelectSeller = (sellerId: string | undefined) => {
    if (sellerId !== null) {
      setIsSellerValid(true);
      setSelectedSeller(Number(sellerId));
    }
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
              onSubmit={handleSubmit}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <header className="flex w-full items-center justify-between">
                  <h3
                    className="text-3xl leading-6 font-bold text-blue-900"
                    id="modal-title"
                  >
                    Registrar Abono o Retiro
                  </h3>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-4xl text-gray-500 hover:text-gray-900"
                  >
                    &times;
                  </button>
                </header>
                <div className="mb-2">
                  <div className="block text-base md:text-lg font-normal mb-2 text-gray-700">
                    <label htmlFor="tipo">Tipo: </label>
                    <Select
                      options={TiposOptions}
                      onChange={(e) => handleSelectTipo(e?.value)}
                      isSearchable={true}
                      placeholder="Seleccione un tipo"
                      className="w-full"
                    />
                    {!isTipoValid && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </div>
                  <div className="block text-base md:text-lg font-normal mb-2 text-gray-700">
                    <label htmlFor="">Vendedor: </label>
                    <Select
                      options={SellersOptions}
                      onChange={(e) => handleSelectSeller(e?.value)}
                      isSearchable={true}
                      placeholder="Seleccione un vendedor"
                      className="w-full"
                    />
                    {!isSellerValid && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </div>
                  <div className="block text-base md:text-lg font-normal mb-2 text-gray-700">
                    <label htmlFor="numero cuotas">
                      {`Monto a ${
                        selectedTipo === "Abono" ? "Abonar" : "Retirar"
                      }`}
                      :
                    </label>
                    <input
                      type="number"
                      className={`p-2 rounded-md border w-full text-sm ${
                        !isMontoValid ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        setIsMontoValid(true);
                        setMonto(Number(e.target.value));
                      }}
                    />
                    {!isMontoValid && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </div>
                  <label
                    htmlFor=""
                    className="block text-base md:text-lg font-normal text-gray-700"
                  >
                    {`Descripcion del ${
                      selectedTipo === "Abono"
                        ? "abono a realizar:"
                        : "retiro a realizar:"
                    }`}
                  </label>
                  <textarea
                    name=""
                    id=""
                    cols={10}
                    rows={4}
                    className={`p-2 rounded-md border w-full text-sm font-normal ${
                      !isDescripcionValid ? "border-red-500" : ""
                    }`}
                    onChange={(e) => {
                      setIsDescripcionValid(true);
                      setDescripcion(e.target.value);
                    }}
                    style={{ resize: "none" }}
                  ></textarea>
                  {!isDescripcionValid && (
                    <p className="text-red-500 text-xs">
                      Este campo es obligatorio
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-900 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {`${
                    selectedTipo
                      ? `Realizar ${selectedTipo}`
                      : `Realizar ${selectedTipo}`
                  }`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrarAbonoRetiroModal;
