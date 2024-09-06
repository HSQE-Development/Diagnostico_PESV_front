import {
  Ciiu,
  Company,
  CompanyDTO,
  DriverQuestion,
  VehicleQuestion,
} from "@/interfaces/Company";
import { MisionalitySizeCriteria, Mission } from "@/interfaces/Dedication";
import axiosBaseQuery from "@/utils/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import { corporateGroupService } from "./corporateGroupService";
import { userService } from "./userService";

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
export const companyService = createApi({
  reducerPath: "companyApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["GetCompamies"],
  endpoints: (builder) => ({
    findAll: builder.query<Company[], { arlId?: number | null }>({
      query: ({ arlId }) => ({
        url: `/companies/`,
        method: "GET",
        params: { arlId: arlId !== undefined ? arlId : null },
      }),
      providesTags: ["GetCompamies"],
    }),
    findById: builder.query<Company, { id: number }>({
      query: ({ id }) => ({
        url: `/companies/${id}`,
        method: "GET",
      }),
    }),
    updateCompany: builder.mutation<Company, Partial<Company>>({
      query: (updatedCompany) => ({
        url: `/companies/update/${updatedCompany.id}/`,
        method: "PATCH",
        data: {
          ...updatedCompany,
        },
      }),
      invalidatesTags: ["GetCompamies"],
    }),
    deleteCompany: builder.mutation<Company, { id: number }>({
      query: ({ id }) => ({
        url: `/companies/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GetCompamies"],
    }),
    save: builder.mutation<Company, CompanyDTO>({
      query: (companyData) => ({
        url: `/companies/`,
        method: "POST",
        data: {
          ...companyData,
        },
      }),
      invalidatesTags: ["GetCompamies"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        // Invalida el tag 'User' en el servicio 'userApi'
        dispatch(
          corporateGroupService.util.invalidateTags(["CompaniesNotIncorpored"])
        );
        dispatch(userService.util.invalidateTags(["FindUserById"]));
      },
    }),
    findAllDedications: builder.query<Mission[], void>({
      query: () => ({
        url: `/companies/findAllMissions`,
        method: "GET",
      }),
    }),
    findcompanySizeByDedicactionId: builder.query<
      MisionalitySizeCriteria[],
      { id: number }
    >({
      query: ({ id }) => ({
        url: `/companies/findCompanySizeByMissionId?mission=${id}`,
        method: "GET",
      }),
    }),
    findAllVehicleQuestions: builder.query<VehicleQuestion[], void>({
      query: () => ({
        url: `/companies/findAllVehicleQuestions`,
        method: "GET",
      }),
    }),
    findAllDriverQuestions: builder.query<DriverQuestion[], void>({
      query: () => ({
        url: `/companies/findAllDriverQuestions`,
        method: "GET",
      }),
    }),
    findCiiuByCode: builder.query<Ciiu[], { codeCiiu: string }>({
      query: ({ codeCiiu }) => ({
        url: `/companies/findCiiuByCode`,
        method: "GET",
        params: {
          ciiu_code: codeCiiu,
        },
      }),
    }),
    diagnosisByCompany: builder.query<any, void>({
      query: () => ({
        url: `/companies/diagnosis_by_company`,
        method: "GET",
      }),
    }),
    findCompanyByNit: builder.query<Company, { nit: string }>({
      query: ({ nit }) => ({
        url: `/companies/find_company_by_nit`,
        method: "GET",
        params: {
          nit: nit,
        },
      }),
    }),
  }),
});
