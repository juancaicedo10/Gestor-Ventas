const MAX_LADO_PX = 1280;
const CALIDAD_JPEG = 0.8;

// Si el navegador no puede decodificar el formato (p. ej. HEIC en Chrome),
// se devuelve el archivo original para no bloquear el envío.
export async function comprimirImagen(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const escala = Math.min(1, MAX_LADO_PX / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * escala);
    canvas.height = Math.round(bitmap.height * escala);

    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", CALIDAD_JPEG)
    );
    if (!blob || blob.size >= file.size) return file;

    const nombre = `${file.name.replace(/\.[^.]+$/, "") || "foto"}.jpg`;
    return new File([blob], nombre, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
