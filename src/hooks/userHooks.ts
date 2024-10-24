import { IUser, UserDTO } from "@/interfaces/IUser";
import { updateUser } from "@/stores/features/authSlice";
import { setUpdateUser, setUser, setUsers } from "@/stores/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { userService } from "@/stores/services/userService";
import { TOAST_TYPE, toastHandler } from "@/utils/useToast";
import { skipToken } from "@reduxjs/toolkit/query";

type useUserArgs = {
  id?: number;
};

const useUser = (props?: useUserArgs) => {
  const dispatch = useAppDispatch();
  const usersStore = useAppSelector((state) => state.users.users);

  const [update, { isLoading: updateLoading }] =
    userService.useUpdateMutation();

  const [register, { isLoading: createLoading }] =
    userService.useRegisterMutation();

  const { data: userById, isLoading: findUserLoading } =
    userService.useFindByIdQuery(props?.id ? { id: props.id } : skipToken);

  const fetchUsers = async (users: IUser[]) => {
    try {
      dispatch(setUsers(users));
    } catch (error: any) {
      toastHandler(TOAST_TYPE.ERROR_TOAST, "Error al consultar");
    }
  };

  const findUserById = async (id: number) => {
    let user = usersStore.find((u) => u.id === id);

    if (!user) {
      try {
        if (userById) {
          user = userById;
        }
      } catch (error: any) {
        toastHandler(TOAST_TYPE.ERROR_TOAST, "Error al buscar usuario");
      }
    }
    return user;
  };

  const changeUser = async (
    id: number,
    values: UserDTO,
    is_my_profile?: boolean
  ) => {
    try {
      const updatedUser = await update({
        id,
        first_name: values.first_name,
        last_name: values.last_name,
        cedula: values.cedula,
        licensia_sst: values.licensia_sst,
        email: values.email,
        avatar: values.avatar,
        password: values.password,
      }).unwrap();
      toastHandler(TOAST_TYPE.SUCCESS_TOAST, "Actualizado Correctamente");
      if (is_my_profile) dispatch(updateUser(updatedUser));

      dispatch(setUpdateUser(updatedUser));
    } catch (error: any) {
      toastHandler(TOAST_TYPE.ERROR_TOAST, "Error al actualizar");
    }
  };

  const createUser = async (values: UserDTO) => {
    try {
      const registered = await register(values).unwrap();
      toastHandler(TOAST_TYPE.SUCCESS_TOAST, "Creado Correctamente");
      dispatch(setUser(registered));
    } catch (error: any) {
      toastHandler(TOAST_TYPE.ERROR_TOAST, "Error al actualizar");
    }
  };

  return {
    changeUser,
    updateLoading,
    createUser,
    createLoading,
    fetchUsers,
    findUserById,
    findUserLoading,
  };
};

export default useUser;
