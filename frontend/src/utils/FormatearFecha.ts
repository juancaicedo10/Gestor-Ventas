export const FormatearFecha = (fecha: string): string => {

    if (!fecha) {
      return '';
    }
    // Extraer la parte de la hora de la cadena
    const horaParte = fecha.slice(11, 19); // "23:50:30"
    
    // Dividir la hora, minutos y segundos
    let [horas, minutos] = horaParte.split(':').map(Number);
  
    // Determinar AM o PM
    const ampm = horas >= 12 ? 'PM' : 'AM';
  
    // Convertir la hora de 24 horas a 12 horas
    horas = horas % 12;
    horas = horas ? horas : 12; // La hora '0' debe ser '12'
    const horasFormateadas = horas.toString().padStart(2, '0');
  
    // Formatear la hora en el formato HH:mm:ss AM/PM
    const horaFormateada = `${horasFormateadas}:${minutos.toString().padStart(2, '0')} ${ampm}`;
  
    return horaFormateada;
  }