import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  getGastos: () => void;
}

const NuevoTipoGastoModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  getGastos,
}) => {

  // properties to create sell

  const [nombreGasto, setNombreGasto] = useState<string>("");
  const [descripcionGasto, setDescripcionGasto] = useState<string>("");
  const [montoMaximo, setMontoMaximo] = useState<number>(0);

  // const [isSellerValid, setIsSellerValid] = useState<boolean>(true);
  // const [isClientValid, setIsClientValid] = useState<boolean>(true);
  ;
  const [isNombreGastoValid, setIsNombreGastoValid] = useState<boolean>(false);
  const [isDescripcionValid, setIsDescripcionValid] = useState<boolean>(false);
  const [isMontoMaximoValid, setIsMontoMaximoValid] = useState<boolean>(false);
  // const [isValorSeguroValid, setIsValorSeguroValid] = useState<boolean>(true);



  const handleSubmit = (e: any) => {
    e.preventDefault();


    let isValid = true;

    if (!nombreGasto) {
      isValid = false;
      setIsNombreGastoValid(false);
    }
    if (!descripcionGasto) {
      isValid = false;
      setIsDescripcionValid(false);
    }
    if (!montoMaximo) {
      isValid = false;
      setIsMontoMaximoValid(false);
    }

    if (!isValid) return;


    const TipoGasto = {
      Nombre: nombreGasto,
      Descripcion: descripcionGasto,
      MontoMaximo: montoMaximo,
    };

    axios
      .post("http://localhost:5000/api/gastos/tipo", TipoGasto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        console.log("Venta CREADA EXITOSAMENTE");
        getGastos();
        onClose();
      })
      .catch((err) => {
        console.log(err);
        onClose();
      });
  };

  useEffect(() => {
    if (!isOpen) {
      setNombreGasto("");
      setDescripcionGasto("");
      setMontoMaximo(0);
      setIsNombreGastoValid(true);
      setIsDescripcionValid(true);
      setIsMontoMaximoValid(true);
    }
  }, [isOpen]);

  // console.log(decodeToken().user);

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
              {" "}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <header className="flex w-full items-center justify-between">
                  <h3
                    className="text-3xl leading-6 font-bold text-blue-900"
                    id="modal-title"
                  >
                    Crear Tipo de Gasto
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
                  <section className="grid grid-cols-2 gap-4 mt-4">
                    <div className="block text-base md:text-lg font-normal mb-2 text-gray-700">
                      <label htmlFor="">Nombre del gasto: </label>
                      <input
                        type="text"
                        className={`p-2 rounded-md border w-full text-sm ${
                          !isNombreGastoValid ? "border-red-500" : ""
                        }`}
                        onChange={(e) => {
                          setNombreGasto(e.target.value);
                          setIsNombreGastoValid(true);
                        }}
                      />
                      {!isNombreGastoValid && (
                        <p className="text-red-500 text-xs">
                          Este campo es obligatorio
                        </p>
                      )}
                    </div>
                    <div className="block text-base md:text-lg font-normal mb-2 text-gray-700">
                      <label htmlFor="numero cuotas">Monto Maximo:</label>
                      <input
                        type="number"
                        className={`p-2 rounded-md border w-full text-sm ${
                          !isMontoMaximoValid ? "border-red-500" : ""
                        }`}
                        onChange={(e) => {
                          setIsMontoMaximoValid(true);
                          setMontoMaximo(Number(e.target.value));
                        }}
                      />
                      {!isMontoMaximoValid && (
                        <p className="text-red-500 text-xs">
                          Este campo es obligatorio
                        </p>
                      )}
                    </div>
                  </section>
                  <label
                    htmlFor=""
                    className="block text-base md:text-lg font-normal text-gray-700"
                  >
                    Descripcion del gasto:
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
                      setDescripcionGasto(e.target.value);
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
                  Crear Tipo de gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NuevoTipoGastoModal;