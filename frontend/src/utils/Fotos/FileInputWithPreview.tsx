import { useEffect, useRef, useState } from "react";

interface FileInputWithPreviewProps {
  file: string;
  onFileSelected?: (file: File | null) => void;
}

export default function FileInputWithPreview({
  file,
  onFileSelected,
}: FileInputWithPreviewProps) {
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(file);
  const inputRef = useRef<HTMLInputElement>(null); // Referencia al input

  useEffect(() => {
    if (file) {
      setPreview(file);

//
    }
  }, [file]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFoto(file);
    onFileSelected?.(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    // inputRef.current?.click(); // Dispara el click en el input oculto
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef}
        onChange={(e) => handleChange(e)}
      />

      {preview && (
        <div
          className="w-40 h-40 rounded-full overflow-hidden border border-gray-300 cursor-pointer"
          onClick={() => handleClick()} // Llama al input oculto
        >
          <img
            src={preview}
            alt="Vista previa"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
