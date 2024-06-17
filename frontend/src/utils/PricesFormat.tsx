export const formatInputValue = (inputValue: string) => {
    // Eliminar cualquier carácter no numérico del valor del input
    const numericString = inputValue.replace(/\D/g, '');
  
    // Convertir el valor del input a un número
    const numericValue = Number(numericString);
  
    // Formatear el número como una cadena de texto con los separadores de miles y el símbolo de la moneda
    return numericValue.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
  };