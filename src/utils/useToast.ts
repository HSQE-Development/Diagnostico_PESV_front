import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Definición de TOAST_TYPE
export const TOAST_TYPE = {
  ERROR_TOAST: 1,
  SUCCESS_TOAST: 2,
} as const;

// Ejemplo de uso
export function toastHandler(
  type: (typeof TOAST_TYPE)[keyof typeof TOAST_TYPE],
  message: string
) {
  switch (type) {
    case TOAST_TYPE.ERROR_TOAST:
      toast.error(message);
      break;
    case TOAST_TYPE.SUCCESS_TOAST:
      toast.success(message);
      break;
    default:
      break;
  }
}
