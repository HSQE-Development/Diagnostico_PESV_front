import {
  Diagnosis,
  Driver,
  Fleet,
  ResponseSaveQuestions,
  SaveQuestionsDTO,
} from "@/interfaces/Company";
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
    findById: builder.query<Diagnosis, { diagnosisId: number }>({
      query: ({ diagnosisId }) => ({
        url: `/diagnosis/${diagnosisId}`,
        method: "GET",
      }),
    }),
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
      { companyId: number; diagnosisId?: number }
    >({
      query: ({ companyId, diagnosisId }) => ({
        url: `/diagnosis/findQuestionsByCompanySize?company=${companyId}&diagnosis=${diagnosisId}&group_by_step=true`,
        method: "GET",
      }),
    }),
    radarChart: builder.query<
      RadarData[],
      { companyId: number; diagnosisId?: number }
    >({
      query: ({ companyId, diagnosisId }) => ({
        url: `/diagnosis/radarChart?company_id=${companyId}&diagnosis=${diagnosisId}`,
        method: "GET",
      }),
    }),
    tableReportTotal: builder.query<
      TotalReport,
      { companyId: number; diagnosisId?: number }
    >({
      query: ({ companyId, diagnosisId }) => ({
        url: `/diagnosis/tableReportTotal?company_id=${companyId}&diagnosis=${diagnosisId}`,
        method: "GET",
      }),
    }),
    tableReport: builder.query<
      any,
      { companyId: number; diagnosisId?: number }
    >({
      query: ({ companyId, diagnosisId }) => ({
        url: `/diagnosis/tableReport?company_id=${companyId}&diagnosis=${diagnosisId}`,
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
      { companyId: number; format_to_save: string; diagnosisId?: number }
    >({
      query: ({ companyId, format_to_save, diagnosisId }) => ({
        url: `/diagnosis/generateReport/`,
        method: "POST",
        params: {
          company: companyId,
          format_to_save: format_to_save,
          diagnosis: diagnosisId,
        },
      }),
    }),
    findFleetsByCompanyId: builder.query<
      Fleet[],
      { companyId: number; diagnosisId?: number }
    >({
      query: ({ companyId, diagnosisId }) => ({
        url: `/diagnosis/findFleetsByCompanyId`,
        method: "GET",
        params: {
          company: companyId,
          diagnosis: diagnosisId,
        },
      }),
    }),
    findDriversByCompanyId: builder.query<
      Driver[],
      { companyId: number; diagnosisId?: number }
    >({
      query: ({ companyId, diagnosisId }) => ({
        url: `/diagnosis/findDriversByCompanyId`,
        method: "GET",
        params: {
          company: companyId,
          diagnosis: diagnosisId,
        },
      }),
    }),
    saveAnswerCuestions: builder.mutation<
      ResponseSaveQuestions,
      SaveQuestionsDTO
    >({
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
