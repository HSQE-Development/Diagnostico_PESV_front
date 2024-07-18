import { Arl, ArlDTO } from "@/interfaces/Arl";
import axiosBaseQuery from "@/utils/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

// const { useLoginMutation } = companyService;
// export { useLoginMutation }; // Esta exportación causa un error de TypeScript
/**
 * IMPORTANTE:
 * Debido a una limitación actual, no se pueden exportar los hooks individualmente sin causar problemas de tipos.
 * El siguiente código es un intento de exportar el hook useLoginMutation, pero resulta en el siguiente error de TypeScript:
 * "El tipo inferido de 'useLoginMutation' no se puede nombrar sin una referencia a '../../../node_modules/@reduxjs/toolkit/dist/query/react/buildHooks'. Es probable que esto no sea portátil. Es necesaria una anotación de tipo.ts(2742)"
 * en su lugar llamar directamente a authService y acceder al hook
 * @example
   arlService.findAll(...params)
 */
export const arlService = createApi({
  reducerPath: "arlApi",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    findAll: builder.query<Arl[], void>({
      query: () => ({
        url: "/arl/",
        method: "GET",
      }),
    }),
    findById: builder.query<Arl, { id: number }>({
      query: ({ id }) => ({
        url: `/arl/${id}`,
        method: "GET",
      }),
    }),
    updateArl: builder.mutation<Arl, Partial<Arl>>({
      query: (updatedArl) => ({
        url: `/arl/update`,
        method: "PATCH",
        data: {
          ...updatedArl,
        },
      }),
    }),
    deleteArl: builder.mutation<Arl, { id: number }>({
      query: ({ id }) => ({
        url: `/arl/delete/${id}`,
        method: "DELETE",
      }),
    }),
    save: builder.mutation<Arl, ArlDTO>({
      query: (arlData) => ({
        url: `/arl/save`,
        method: "POST",
        data: {
          ...arlData,
        },
      }),
    }),
  }),
});
