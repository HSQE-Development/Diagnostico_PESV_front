import { Company } from "@/interfaces/Company";
import axiosBaseQuery from "@/utils/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

/**
 * IMPORTANTE:
 * Debido a una limitación actual, no se pueden exportar los hooks individualmente sin causar problemas de tipos.
 * El siguiente código es un intento de exportar el hook useLoginMutation, pero resulta en el siguiente error de TypeScript:
 * "El tipo inferido de 'useLoginMutation' no se puede nombrar sin una referencia a '../../../node_modules/@reduxjs/toolkit/dist/query/react/buildHooks'. Es probable que esto no sea portátil. Es necesaria una anotación de tipo.ts(2742)"
 * en su lugar llamar directamente a authService y acceder al hook
 * @example
   companyService.findAll(...params)
 */

// const { useLoginMutation } = companyService;
// export { useLoginMutation }; // Esta exportación causa un error de TypeScript
export const segmentService = createApi({
  reducerPath: "segmentApi",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    findAll: builder.query<Company[], void>({
      query: () => ({
        url: "/companies/findAllSegments",
        method: "GET",
      }),
    }),
    // findById: builder.query<Company, {id:number}>({
    //     query: ({id}) => ({
    //         url: `/companies/${id}`,
    //         method: "GET",
    //     })
    // }),
    // updateCompany: builder.mutation<Company, Partial<Company>>({
    //     query: (updatedCompany) => ({
    //         url: `/companies/update`,
    //         method: "PATCH",
    //         data: {
    //             ...updatedCompany
    //         }
    //     })
    // }),
    // deleteCompany: builder.query<Company, {id:number}>({
    //     query: ({id}) => ({
    //         url: `/companies/delete/${id}`,
    //         method: "DELETE",
    //     })
    // }),
  }),
});
