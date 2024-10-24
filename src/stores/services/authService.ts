import { MenuSideProps } from "@/Components/MenuSide";
import { IAuth } from "@/interfaces/IAuth";
import { IUser } from "@/interfaces/IUser";
import axiosBaseQuery from "@/utils/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

/**
 * IMPORTANTE:
 * Debido a una limitación actual, no se pueden exportar los hooks individualmente sin causar problemas de tipos.
 * El siguiente código es un intento de exportar el hook useLoginMutation, pero resulta en el siguiente error de TypeScript:
 * "El tipo inferido de 'useLoginMutation' no se puede nombrar sin una referencia a '../../../node_modules/@reduxjs/toolkit/dist/query/react/buildHooks'. Es probable que esto no sea portátil. Es necesaria una anotación de tipo.ts(2742)"
 * en su lugar llamar directamente a authService y acceder al hook
 * @example
   authService.useLoginMutation(...params)
 */

// const { useLoginMutation } = authService;
// export { useLoginMutation }; // Esta exportación causa un error de TypeScript
export const authService = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["myProfileQuery"],
  endpoints: (builder) => ({
    login: builder.mutation<IAuth, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: "/sign/login",
        method: "POST",
        data: {
          email,
          password,
        },
      }),
    }),
    logout: builder.mutation<{ message: string }, { refresh: string }>({
      query: ({ refresh }) => ({
        url: "/sign/logout",
        method: "POST",
        data: {
          refresh: refresh,
        },
      }),
    }),
    myProfile: builder.query<IUser, void>({
      query: () => ({
        url: "/sign/profile",
        method: "GET",
      }),
      providesTags: ["myProfileQuery"],
    }),
    findById: builder.query<IUser, { user?: number }>({
      query: ({ user }) => ({
        url: "/sign/find_by_id",
        method: "GET",
        params: {
          user: user,
        },
      }),
    }),
    menusByGrups: builder.query<MenuSideProps[], { groups: number[] }>({
      query: ({ groups }) => ({
        url: "/sign/menus/group",
        method: "GET",
        params: {
          groups: groups.join(","),
        },
      }),
    }),
  }),
});
