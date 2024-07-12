/**
 *
 * @param value el numero nit en string
 * Funcion para formatear el NIT en formato XXXXXXXXX-X
 * @returns retorna en estring el nit formateado
 *
 * Al enviar el nit porfavor usar la funcion:
 * @example
 * removeHyphen(nit, "-")
 * @readonly
 * para volverlo al valor absoluto sin el -
 */
export const formatNIT = (value: string) => {
  const cleaned = ("" + value).replace(/\D/g, "");
  // Si la longitud es mayor a 9, asegúrate de dividir correctamente
  if (cleaned.length > 9) {
    const prefix = cleaned.substring(0, 9);
    const suffix = cleaned.substring(9, 10);
    return `${prefix}-${suffix}`;
  }
  return cleaned;
};

/**
 *
 * @param value La cadena STRING a la que queremos remover el caracter
 * @param characterToRemove caracter que queremos remover de la palabra
 *
 * @returns La cadena sin el caracter que necesitamos remover
 */
export const removeHyphen = (value: string, characterToRemove: string) => {
  const regex = new RegExp(characterToRemove, "g");
  return value.replace(regex, "");
};

//CUANDO SE PASEN IDS POR URL ENVIARLOS ENCRIPTADOS
export function encryptId(id: string): string {
  return btoa(id); // Base64 encoding
}

//USARLO PARA DESENCRIPTAR EL ID
export function decryptId(encryptedId: string): string {
  return atob(encryptedId); // Base64 decoding
}
