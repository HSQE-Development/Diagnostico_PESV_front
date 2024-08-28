import { UserDTO } from "@/interfaces/IUser";
import { updateUser } from "@/stores/features/authSlice";
import { useAppDispatch } from "@/stores/hooks";
import { userService } from "@/stores/services/userService";
import { TOAST_TYPE, toastHandler } from "@/utils/useToast";

const useUser = () => {
  const dispatch = useAppDispatch();
  const [update, { isLoading: updateLoading }] =
    userService.useUpdateMutation();

  const [register, { isLoading: createLoading }] =
    userService.useRegisterMutation();

  const changeUser = async (id: number, values: UserDTO) => {
    try {
      const updatedUser = await update({
        id,
        first_name: values.first_name,
        last_name: values.last_name,
        cedula: values.cedula,
        licensia_sst: values.licensia_sst,
        email: values.email,
        avatar: values.avatar,
      }).unwrap();
      toastHandler(TOAST_TYPE.SUCCESS_TOAST, "Actualizado Correctamente");
      dispatch(updateUser(updatedUser));
    } catch (error: any) {
      toastHandler(TOAST_TYPE.ERROR_TOAST, "Error al actualizar");
      console.error("Error updating user:", error);
    }
  };

  const createUser = async (values: UserDTO) => {
    try {
      await register(values).unwrap();
      toastHandler(TOAST_TYPE.SUCCESS_TOAST, "Actualizado Correctamente");
      //   dispatch(updateUser(updatedUser));
    } catch (error: any) {
      toastHandler(TOAST_TYPE.ERROR_TOAST, "Error al actualizar");
      console.error("Error updating user:", error);
    }
  };

  return {
    changeUser,
    updateLoading,
    createUser,
    createLoading,
  };
};

export default useUser;
