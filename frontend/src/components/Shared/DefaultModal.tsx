// src/components/Modal.jsx
const DefaultModal = ({
  title,
  message,
  onClose,
}: {
  title: string;
  message: string;
  onClose: any;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md border-t-4 border-fifth">
        <h2 className="text-xl font-semibold text-quaternary mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-quaternary hover:bg-tertiary text-white font-medium rounded-lg transition duration-200"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default DefaultModal;
