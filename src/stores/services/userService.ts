import { Group } from "@/interfaces/Group";
import { IUser, UserDTO } from "@/interfaces/IUser";
import axiosBaseQuery from "@/utils/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
/**
 * IMPORTANTE:
 * Debido a una limitación actual, no se pueden exportar los hooks individualmente sin causar problemas de tipos.
 * El siguiente código es un intento de exportar el hook useLoginMutation, pero resulta en el siguiente error de TypeScript:
 * "El tipo inferido de 'useLoginMutation' no se puede nombrar sin una referencia a '../../../node_modules/@reduxjs/toolkit/dist/query/react/buildHooks'. Es probable que esto no sea portátil. Es necesaria una anotación de tipo.ts(2742)"
 * en su lugar llamar directamente a authService y acceder al hook
 * @example
   userService.findAll(...params)
 */
// const { useLoginMutation } = companyService;
// export { useLoginMutation }; // Esta exportación causa un error de TypeScript
export const userService = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["FetchUsers", "FindUserById"],
  endpoints: (builder) => ({
    findAll: builder.query<IUser[], void>({
      query: () => ({
        url: "/sign/findAll",
        method: "GET",
      }),
      providesTags: ["FetchUsers"],
    }),
    findAllConsultants: builder.query<IUser[], void>({
      query: () => ({
        url: "/sign/findAllConsultants",
        method: "GET",
      }),
    }),
    findAllGroups: builder.query<Group[], void>({
      query: () => ({
        url: "/sign/findAllGroups",
        method: "GET",
      }),
    }),
    update: builder.mutation<IUser, Partial<IUser>>({
      query: (dataToChange) => ({
        url: "/sign/update",
        method: "PATCH",
        data: {
          ...dataToChange,
        },
      }),
      invalidatesTags: ["FetchUsers", "FindUserById"],
    }),
    register: builder.mutation<IUser, UserDTO>({
      query: (dataToChange) => ({
        url: "/sign/register",
        method: "POST",
        data: dataToChange,
      }),
      invalidatesTags: ["FetchUsers", "FindUserById"],
    }),
    findById: builder.query<IUser, { id: number }>({
      query: ({ id }) => ({
        url: `/sign/${id}`,
        method: "GET",
      }),
      providesTags: ["FindUserById"],
    }),
  }),
});
