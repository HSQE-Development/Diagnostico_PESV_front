import { Driver, Fleet, SaveQuestionsDTO } from "@/interfaces/Company";
import {
  CheckListDTO,
  DiagnosisChecklist,
  DiagnosisDTO,
  DiagnosisQuestions,
  DiagnosisQuestionsGroup,
  RadarData,
  TotalReport,
} from "@/interfaces/Diagnosis";
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
   diagnosisService.findAll(...params)
 */
export const diagnosisService = createApi({
  reducerPath: "diagnosisApi",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    findQuestionsByCompanySize: builder.query<
      DiagnosisQuestions[],
      { companyId: number }
    >({
      query: ({ companyId }) => ({
        url: `/diagnosis/findQuestionsByCompanySize?company=${companyId}`,
        method: "GET",
      }),
    }),
    findQuestionsByCompanysizeGrouped: builder.query<
      DiagnosisQuestionsGroup[],
      { companyId: number }
    >({
      query: ({ companyId }) => ({
        url: `/diagnosis/findQuestionsByCompanySize?company=${companyId}&group_by_step=true`,
        method: "GET",
      }),
    }),
    radarChart: builder.query<RadarData[], { companyId: number }>({
      query: ({ companyId }) => ({
        url: `/diagnosis/radarChart?company_id=${companyId}`,
        method: "GET",
      }),
    }),
    tableReportTotal: builder.query<TotalReport, { companyId: number }>({
      query: ({ companyId }) => ({
        url: `/diagnosis/tableReportTotal?company_id=${companyId}`,
        method: "GET",
      }),
    }),
    tableReport: builder.query<any, { companyId: number }>({
      query: ({ companyId }) => ({
        url: `/diagnosis/tableReport?company_id=${companyId}`,
        method: "GET",
      }),
    }),
    saveDiagnosis: builder.mutation<DiagnosisChecklist[], CheckListDTO>({
      query: (dataDiagnosis) => ({
        url: `/diagnosis/saveDiagnosis/`,
        method: "POST",
        data: {
          diagnosis_data: dataDiagnosis,
        },
      }),
    }),
    generateReport: builder.mutation<
      { file: string },
      { companyId: number; format_to_save: string }
    >({
      query: ({ companyId, format_to_save }) => ({
        url: `/diagnosis/generateReport/`,
        method: "POST",
        params: { company: companyId, format_to_save: format_to_save },
      }),
    }),
    findFleetsByCompanyId: builder.query<Fleet[], { companyId: number }>({
      query: ({ companyId }) => ({
        url: `/diagnosis/findFleetsByCompanyId`,
        method: "GET",
        params: {
          company: companyId,
        },
      }),
    }),
    findDriversByCompanyId: builder.query<Driver[], { companyId: number }>({
      query: ({ companyId }) => ({
        url: `/diagnosis/findDriversByCompanyId`,
        method: "GET",
        params: {
          company: companyId,
        },
      }),
    }),
    saveAnswerCuestions: builder.mutation<SaveQuestionsDTO, SaveQuestionsDTO>({
      query: (questionsDTO) => ({
        url: `/diagnosis/saveAnswerCuestions/`,
        method: "POST",
        data: {
          ...questionsDTO,
        },
      }),
    }),
  }),
});
