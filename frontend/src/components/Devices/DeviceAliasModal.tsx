import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (nombreAlias: string, notas: string) => Promise<void>;
  title: string;
  initialAlias?: string;
  initialNotas?: string;
  deviceInfo?: string;
  confirmLabel?: string;
}

export default function DeviceAliasModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  initialAlias = "",
  initialNotas = "",
  deviceInfo,
  confirmLabel = "Guardar",
}: Props) {
  const [nombreAlias, setNombreAlias] = useState(initialAlias);
  const [notas, setNotas] = useState(initialNotas);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNombreAlias(initialAlias);
      setNotas(initialNotas);
    }
  }, [isOpen, initialAlias, initialNotas]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreAlias.trim()) return;
    setIsSaving(true);
    try {
      await onConfirm(nombreAlias.trim(), notas.trim());
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed z-[60] inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={onClose} />
        <form
          onSubmit={handleSubmit}
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-10"
        >
          <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
          {deviceInfo && (
            <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-md">
              {deviceInfo}
            </p>
          )}
          <p className="text-sm text-gray-500 mb-3">
            Asigne un nombre que le permita identificar este equipo (ej. Celular
            trabajo Daniel, PC secretaria).
          </p>
          <label className="block font-semibold text-sm mb-1">
            Nombre del dispositivo *
          </label>
          <input
            className="w-full border-2 rounded-md px-3 py-2 mb-3"
            value={nombreAlias}
            onChange={(e) => setNombreAlias(e.target.value)}
            placeholder="Celular trabajo..."
            maxLength={100}
            required
            autoFocus
          />
          <label className="block font-semibold text-sm mb-1">
            Notas (opcional)
          </label>
          <textarea
            className="w-full border-2 rounded-md px-3 py-2 mb-4"
            rows={2}
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Oficina, turno, observaciones..."
            maxLength={250}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border text-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || !nombreAlias.trim()}
              className="px-4 py-2 rounded-md bg-primary text-white font-semibold disabled:opacity-50"
            >
              {isSaving ? "Guardando..." : confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
