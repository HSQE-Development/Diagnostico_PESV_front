/**
 * Porfavor toda FUNCION que se cree aqui dejarla devidamente documentada o que por lo menos se sepa lo que hace la funcion
 *
 */

/**
 *
 * @param value el numero nit en string
 * Funcion para formatear el NIT en formato XXXXXXXXX-X
 * @returns retorna en estring el nit formateado
 *
 * Al enviar el nit porfavor usar la funcion:
 * @example
 * formatNIT("1234567890")
 * return -> "123456789-0"
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

/**
 *
 * @param id
 * CUANDO SE PASEN IDS POR URL ENVIARLOS ENCRIPTADOS
 * @returns
 */
export function encryptId(id: string): string {
  return btoa(id); // Base64 encoding
}

/**
 *
 * @param encryptedId
 * USARLO PARA DESENCRIPTAR EL ID
 * @returns
 */
export function decryptId(encryptedId: string): string {
  return atob(encryptedId); // Base64 decoding
}

/**
 * Actualiza un elemento dentro de un array basado en su propiedad `id`.
 * Si no se encuentra el elemento con el mismo `id`, devuelve el array original sin cambios.
 *
 * @template T Tipo de los elementos del array que deben tener una propiedad `id` de tipo `number`.
 * @param {T[]} array El array original que contiene los elementos a actualizar.
 * @param {T} updatedItem El elemento actualizado que se debe reemplazar en el array.
 * @returns {T[]} Un nuevo array con el elemento actualizado o el array original si no se encontró el elemento.
 */
export const updateItemInArray = <T extends { id: number }>(
  array: T[],
  updatedItem: T
): T[] => {
  const index = array.findIndex((item) => item.id === updatedItem.id);
  if (index !== -1) {
    return [...array.slice(0, index), updatedItem, ...array.slice(index + 1)];
  }
  return array;
};

/**
 * Elimina un elemento de un array basado en su propiedad `id`.
 *
 * @template T Tipo de los elementos del array que deben tener una propiedad `id` de tipo `number`.
 * @param {T[]} array El array original que contiene los elementos a filtrar.
 * @param {number} idToDelete El `id` del elemento que se debe eliminar del array.
 * @returns {T[]} Un nuevo array con el elemento eliminado, o el array original si no se encontró el elemento.
 */
export const deleteItemFromArray = <T extends { id: number }>(
  array: T[],
  idToDelete: number
): T[] => {
  return array.filter((item) => item.id !== idToDelete);
};

/**
 * Agrega un elemento a un array en el estado.
 *
 * @template T Tipo de los elementos del array.
 * @param {T[]} array El array original al cual se debe agregar el elemento.
 * @param {T} newItem El nuevo elemento que se debe agregar al array.
 * @returns {T[]} Un nuevo array que incluye el nuevo elemento al final.
 */
export const addItemToArray = <T>(array: T[], newItem: T): T[] => {
  return [...array, newItem];
};

export function downloadBase64File(base64String: string, fileName: string) {
  // Crear un enlace <a> dinámico
  const link = document.createElement("a");

  // Establecer la URL del enlace usando Base64
  link.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64String}`;

  // Establecer el nombre del archivo
  link.download = fileName;

  // Agregar el enlace al DOM
  document.body.appendChild(link);

  // Hacer clic en el enlace para iniciar la descarga
  link.click();

  // Eliminar el enlace del DOM
  document.body.removeChild(link);
}

const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
];

export const getRandomColorClass = () =>
  colors[Math.floor(Math.random() * colors.length)];
