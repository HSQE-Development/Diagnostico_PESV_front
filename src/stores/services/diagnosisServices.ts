import { ComplianceTrendData } from "@/interfaces/Charts";
import {
  Diagnosis,
  Driver,
  Fleet,
  ResponseSaveQuestions,
  SaveQuestionsDTO,
  SaveQuestionsForCorporateDTO,
} from "@/interfaces/Company";
import {
  CheckListDTO,
  DiagnosisChecklist,
  DiagnosisQuestions,
  DiagnosisQuestionsGroup,
  RadarData,
  TotalReport,
} from "@/interfaces/Diagnosis";
import axiosBaseQuery from "@/utils/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import { userService } from "./userService";
import { Notification } from "@/interfaces/Notification";
import { companyService } from "./companyService";

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
  tagTypes: [
    "DiagnosisQuestions",
    "DiagnosisGeneralData",
    "DiagnosisTableReport",
    "DiagnosisChartReport",
    "DiagnosisTotalTableReport",
    "Notification",
  ],
  endpoints: (builder) => ({
    findById: builder.query<
      Diagnosis,
      { diagnosisId: number; corporate_group?: number }
    >({
      query: ({ diagnosisId, corporate_group }) => ({
        url: `/diagnosis/${diagnosisId}`,
        method: "GET",
        params: {
          corporate_group: corporate_group,
        },
      }),
      providesTags: ["DiagnosisGeneralData"],
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
      providesTags: ["DiagnosisQuestions"],
    }),
    radarChart: builder.query<
      RadarData[],
      { companyId: number; diagnosisId?: number }
    >({
      query: ({ companyId, diagnosisId }) => ({
        url: `/diagnosis/radarChart?company_id=${companyId}&diagnosis=${diagnosisId}`,
        method: "GET",
      }),
      providesTags: ["DiagnosisChartReport"],
    }),
    tableReportTotal: builder.query<
      TotalReport,
      { companyId: number; diagnosisId?: number }
    >({
      query: ({ companyId, diagnosisId }) => ({
        url: `/diagnosis/tableReportTotal?company_id=${companyId}&diagnosis=${diagnosisId}`,
        method: "GET",
      }),
      providesTags: ["DiagnosisTotalTableReport"],
    }),
    tableReport: builder.query<
      any,
      { companyId: number; diagnosisId?: number }
    >({
      query: ({ companyId, diagnosisId }) => ({
        url: `/diagnosis/tableReport?company_id=${companyId}&diagnosis=${diagnosisId}`,
        method: "GET",
      }),
      providesTags: ["DiagnosisTableReport"],
    }),
    saveDiagnosis: builder.mutation<DiagnosisChecklist[], CheckListDTO>({
      query: (dataDiagnosis) => ({
        url: `/diagnosis/saveDiagnosis/?diagnosis=${dataDiagnosis.diagnosis}`,
        method: "POST",
        data: {
          diagnosis_data: dataDiagnosis,
        },
      }),
      invalidatesTags: [
        "DiagnosisTableReport",
        "DiagnosisTotalTableReport",
        "DiagnosisChartReport",
        "DiagnosisQuestions",
        "DiagnosisGeneralData",
      ],
    }),
    generateReport: builder.mutation<
      { file: string },
      {
        companyId: number;
        format_to_save: string;
        diagnosisId?: number;
        sequence: string;
        schedule: string;
      }
    >({
      query: ({
        companyId,
        format_to_save,
        diagnosisId,
        sequence,
        schedule,
      }) => ({
        url: `/diagnosis/generateReport/`,
        method: "POST",
        params: {
          company: companyId,
          format_to_save: format_to_save,
          diagnosis: diagnosisId,
          sequence: sequence,
          schedule: schedule,
        },
      }),
    }),
    generateWorkPlan: builder.mutation<
      { file: string },
      {
        companyId: number;
        format_to_save: string;
        diagnosisId?: number;
      }
    >({
      query: ({ companyId, format_to_save, diagnosisId }) => ({
        url: `/diagnosis/generateWorkPlan/`,
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
      { companyId: number; diagnosisId?: number; corporate_group?: number }
    >({
      query: ({ companyId, diagnosisId, corporate_group }) => ({
        url: `/diagnosis/findFleetsByCompanyId`,
        method: "GET",
        params: {
          company: companyId,
          diagnosis: diagnosisId ?? 0,
          corporate_group: corporate_group,
        },
      }),
    }),
    findDriversByCompanyId: builder.query<
      Driver[],
      { companyId: number; diagnosisId?: number; corporate_group?: number }
    >({
      query: ({ companyId, diagnosisId, corporate_group }) => ({
        url: `/diagnosis/findDriversByCompanyId`,
        method: "GET",
        params: {
          company: companyId,
          diagnosis: diagnosisId ?? 0,
          corporate_group: corporate_group,
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
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(userService.util.invalidateTags(["FindUserById"]));
        dispatch(companyService.util.invalidateTags(["GetCompamies"]));
      },
    }),
    initDiagnosisCorporate: builder.mutation<Diagnosis, { corporate: number }>({
      query: ({ corporate }) => ({
        url: `/diagnosis/init_diagnosis_corporate/`,
        method: "POST",
        data: {
          corporate: corporate,
        },
      }),
    }),
    saveCountForCompanyInCorporate: builder.mutation<
      ResponseSaveQuestions,
      SaveQuestionsForCorporateDTO
    >({
      query: (questionsDTO) => ({
        url: `/diagnosis/save_count_for_company_in_corporate/`,
        method: "POST",
        data: {
          ...questionsDTO,
        },
      }),
    }),
    updateDiagnosis: builder.mutation<Diagnosis, Partial<Diagnosis>>({
      query: (questionsDTO) => ({
        url: `/diagnosis/update_diagnosis/?diagnosis=${questionsDTO.id}`,
        method: "PATCH",
        data: {
          ...questionsDTO,
        },
      }),
      invalidatesTags: ["DiagnosisQuestions", "DiagnosisGeneralData"],
    }),
    countDiagnosisByConsultor: builder.query<any, { consultor_id: number }>({
      query: ({ consultor_id }) => ({
        url: `/diagnosis/count_diagnosis_by_consultor`,
        method: "GET",
        params: {
          consultor: consultor_id,
        },
      }),
    }),
    countDiagnosisByConsultorByType: builder.query<
      any,
      { consultor_id: number }
    >({
      query: ({ consultor_id }) => ({
        url: `/diagnosis/count_diagnosis_by_consultor_by_type`,
        method: "GET",
        params: {
          consultor: consultor_id,
        },
      }),
    }),
    countDiagnosisByConsultorByModeEjecution: builder.query<
      any,
      { consultor_id?: number }
    >({
      query: ({ consultor_id }) => ({
        url: `/diagnosis/count_diagnosis_by_consultor_by_mode_ejecution`,
        method: "GET",
        params: {
          consultor: consultor_id,
        },
      }),
    }),
    countDiagnosisByConsultors: builder.query<any, void>({
      query: () => ({
        url: `/diagnosis/count_diagnosis_by_consultors`,
        method: "GET",
      }),
    }),
    complianceTrend: builder.query<ComplianceTrendData[], void>({
      query: () => ({
        url: `/diagnosis/compliance_trend`,
        method: "GET",
      }),
    }),
    sendReport: builder.mutation<
      string,
      {
        email_to: string;
        diagnosis: number;
        company: number;
        schedule: string;
        sequence: string;
      }
    >({
      query: ({ email_to, diagnosis, company, schedule, sequence }) => ({
        url: `/diagnosis/send_report/`,
        method: "POST",
        data: {
          email_to: email_to,
          diagnosis: diagnosis,
          company: company,
        },
        params: {
          schedule: schedule,
          sequence: sequence,
        },
      }),
    }),
    findNotificationsByUser: builder.query<
      Notification[] | [],
      {
        user: number;
      }
    >({
      query: ({ user }) => ({
        url: `/diagnosis/find_notifications_by_user`,
        method: "GET",
        params: {
          user: user,
        },
      }),
      providesTags: ["Notification"],
    }),
    readNotifications: builder.mutation<
      { message: boolean },
      {
        notifications: number[];
      }
    >({
      query: ({ notifications }) => ({
        url: `/diagnosis/read_notifications/`,
        method: "PATCH",
        data: {
          notifications: notifications,
        },
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});
