import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close"; // Modal simple para mostrar la imagen en grande

function ImageModal({ src, onClose }: { src: string; onClose: () => void }) {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que el click en el fondo cierre el modal
    onClose(); // Llamada para cerrar el modal
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={handleClose} // Cerrar cuando se hace clic en el fondo
    >
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()} // Evitar que el clic en la imagen cierre el modal
      >
        <img
          src={src}
          alt="Foto cliente"
          className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-lg"
        />
        <button
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-200"
          onClick={handleClose} // Cerrar cuando se hace clic en el botón
        >
          <span className="text-xl font-bold text-black flex justify-center items-center">
            <CloseIcon />
          </span>
        </button>
      </div>
    </div>
  );
}


export default ImageModal;