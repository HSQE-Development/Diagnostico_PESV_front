import { ArlDTO } from "@/interfaces/Arl";
import { setArl, setDeleteArl, setUpdateArl } from "@/stores/features/arlSlice";
import { useAppDispatch } from "@/stores/hooks";
import { arlService } from "@/stores/services/arlService";
import { TOAST_TYPE, toastHandler } from "@/utils/useToast";

const useArl = () => {
  const dispatch = useAppDispatch();
  const [updateArl, { isLoading: isUpdating }] =
    arlService.useUpdateArlMutation();

  const [save, { isLoading: isSaving }] = arlService.useSaveMutation();
  const [deleteArl, { isLoading: isDeleting }] =
    arlService.useDeleteArlMutation();

  const changeArl = async (id: number, values: ArlDTO) => {
    try {
      const updatedArl = await updateArl({
        id,
        name: values.name.toUpperCase(),
      }).unwrap();
      toastHandler(TOAST_TYPE.SUCCESS_TOAST, "Actualizado Correctamente");
      dispatch(setUpdateArl(updatedArl));
    } catch (error: any) {
      toastHandler(TOAST_TYPE.ERROR_TOAST, "Error al actualizar");
      console.error("Error updating company:", error);
    }
  };

  const createArl = async (values: ArlDTO) => {
    try {
      values.name = values.name.toUpperCase();
      const savedArl = await save(values).unwrap();
      toastHandler(TOAST_TYPE.SUCCESS_TOAST, "Registrado Correctamente");
      dispatch(setArl(savedArl));
    } catch (error: any) {
      toastHandler(TOAST_TYPE.ERROR_TOAST, error.data.error);
      console.error("Error creating company:", error);
    }
  };

  const deleteArlById = async (id: number) => {
    try {
      const deletedArl = await deleteArl({
        id,
      }).unwrap();
      dispatch(setDeleteArl(deletedArl.id ?? id));
    } catch (error: any) {
      throw error;
    }
  };

  return {
    changeArl,
    createArl,
    deleteArlById,
    isUpdating,
    isSaving,
    isDeleting,
  };
};

export default useArl;
