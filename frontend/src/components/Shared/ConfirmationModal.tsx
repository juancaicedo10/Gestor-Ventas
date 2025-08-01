
import { toast } from "react-toastify";
import HttpClient from "../../Services/httpService";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  getData: () => void;
  text: string;
  url: string;
  archivada: () => void;
}

const ConfirmationModal: React.FC<ModalProps> = ({ isOpen, onClose, url, getData, text, archivada }) => {

  const handleDelete = () => {
    try {
      HttpClient.delete(
          `${url}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          getData();
          archivada();
          onClose();
        })
        .catch((err) => toast.error(err.response.data.message));
    } catch (error) {
      console.log("Error eliminando Tipo Gasto: ", error);
    }
  };


  if (!isOpen) return null;

      return (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                     Confirmacion
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                      {  text }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-quaternary text-base font-medium text-white hover:bg-tertiary focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => onClose()}
                >
                  No
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    handleDelete();
                    onClose()}}
                >
                  Si
                </button>
              </div>
            </div>
          </div>
        </div>
  );
}

export default ConfirmationModal;
