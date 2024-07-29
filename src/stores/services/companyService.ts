import {
  Ciiu,
  Company,
  CompanyDTO,
  Driver,
  DriverQuestion,
  Fleet,
  SaveQuestionsDTO,
  VehicleQuestion,
} from "@/interfaces/Company";
import { CompanySize, Mission } from "@/interfaces/Dedication";
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
export const companyService = createApi({
  reducerPath: "companyApi",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    findAll: builder.query<Company[], { arlId?: number | null }>({
      query: ({ arlId }) => ({
        url: `/companies/`,
        method: "GET",
        params: { arlId: arlId !== undefined ? arlId : null },
      }),
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
    }),
    deleteCompany: builder.mutation<Company, { id: number }>({
      query: ({ id }) => ({
        url: `/companies/delete/${id}`,
        method: "DELETE",
      }),
    }),
    save: builder.mutation<Company, CompanyDTO>({
      query: (companyData) => ({
        url: `/companies/`,
        method: "POST",
        data: {
          ...companyData,
        },
      }),
    }),
    findAllDedications: builder.query<Mission[], void>({
      query: () => ({
        url: `/companies/findAllMissions`,
        method: "GET",
      }),
    }),
    findcompanySizeByDedicactionId: builder.query<
      CompanySize[],
      { id: number }
    >({
      query: ({ id }) => ({
        url: `/companies/findCompanySizeByMissionId/${id}`,
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
    findFleetsByCompanyId: builder.query<Fleet[], { companyId: number }>({
      query: ({ companyId }) => ({
        url: `/companies/findFleetsByCompanyId`,
        method: "GET",
        params: {
          company: companyId,
        },
      }),
    }),
    findDriversByCompanyId: builder.query<Driver[], { companyId: number }>({
      query: ({ companyId }) => ({
        url: `/companies/findDriversByCompanyId`,
        method: "GET",
        params: {
          company: companyId,
        },
      }),
    }),
    saveAnswerCuestions: builder.mutation<SaveQuestionsDTO, SaveQuestionsDTO>({
      query: (questionsDTO) => ({
        url: `/companies/saveAnswerCuestions/`,
        method: "POST",
        data: {
          ...questionsDTO,
        },
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
  }),
});
