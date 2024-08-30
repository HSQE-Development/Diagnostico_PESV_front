import { Company } from "@/interfaces/Company";
import { PaginationComun } from "@/interfaces/Comun";
import {
  CorporateDTO,
  CorporateGroupPagination,
  ICorporateGroup,
} from "@/interfaces/CorporateGroup";
import axiosBaseQuery from "@/utils/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

/**
 * IMPORTANTE:
 * Debido a una limitación actual, no se pueden exportar los hooks individualmente sin causar problemas de tipos.
 * El siguiente código es un intento de exportar el hook useCorporateGroupMutation, pero resulta en el siguiente error de TypeScript:
 * "El tipo inferido de 'useCorporateGroupMutation' no se puede nombrar sin una referencia a '../../../node_modules/@reduxjs/toolkit/dist/query/react/buildHooks'. Es probable que esto no sea portátil. Es necesaria una anotación de tipo.ts(2742)"
 * en su lugar llamar directamente a corporateGroupService y acceder al hook
 * @example
   corporateGroupService.findAll(...params)
 */
export const corporateGroupService = createApi({
  reducerPath: "corporateGroupApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["CorporateGroups", "CorporateGroupById", "CompaniesNotIncorpored"],
  endpoints: (builder) => ({
    // Define aquí tus endpoints
    findAll: builder.query<
      CorporateGroupPagination,
      { page: number; page_size: number }
    >({
      query: ({ page, page_size }) => ({
        url: "/corporate_groups/",
        method: "GET",
        params: {
          page: page,
          page_size: page_size,
        },
      }),
      providesTags: ["CorporateGroups"],
    }),
    findById: builder.query<ICorporateGroup, { id: number }>({
      query: ({ id }) => ({
        url: `/corporate_groups/${id}`,
        method: "GET",
      }),
      providesTags: ["CorporateGroupById"],
    }),
    saveCorporateGroup: builder.mutation<ICorporateGroup, CorporateDTO>({
      query: (dataDto) => ({
        url: "/corporate_groups/",
        method: "POST",
        data: dataDto,
      }),
      invalidatesTags: ["CorporateGroups"],
    }),

    findCompaniesNotInCorporate: builder.query<
      PaginationComun<Company>,
      { corporate: number }
    >({
      query: ({ corporate }) => ({
        url: "/corporate_groups/companies_not_in_corporate",
        method: "GET",
        params: {
          corporate: corporate,
        },
      }),
      providesTags: ["CompaniesNotIncorpored"],
    }),
    addOrRemoveCompanyOfGroupByGroupId: builder.mutation<
      Company,
      { action: "add" | "delete"; company: number; group: number }
    >({
      query: ({ action, company, group }) => ({
        url: "/corporate_groups/add_or_remove_company_of_group_by_group_id/",
        method: "POST",
        data: {
          action,
          company,
          group,
        },
      }),
      invalidatesTags: ["CompaniesNotIncorpored", "CorporateGroups"],
    }),
  }),
});
