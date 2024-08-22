import { corporateGroupService } from "@/stores/services/corporateGroupService";
import { TOAST_TYPE, toastHandler } from "@/utils/useToast";
import { Pagination, Skeleton } from "antd";
import React, { lazy, Suspense, useEffect } from "react";
interface CompanyListProps {
  corporateId: number;
}
const CompanyCards = lazy(() => import("./CompanyCards"));

export default function CompanyList({ corporateId }: CompanyListProps) {
  const { data, isLoading, refetch } =
    corporateGroupService.useFindCompaniesNotInCorporateQuery({
      corporate: corporateId,
    });

  const [addOrRemoveCompanyOfGroupByGroupId, { isLoading: addLoading }] =
    corporateGroupService.useAddOrRemoveCompanyOfGroupByGroupIdMutation();

  const results = Array.isArray(data?.results) ? data.results : [];

  const handleAddCompanyToGroup = async (companyId: number) => {
    try {
      await addOrRemoveCompanyOfGroupByGroupId({
        action: "add",
        company: companyId,
        group: corporateId,
      }).unwrap();
      toastHandler(TOAST_TYPE.SUCCESS_TOAST, "Empresa agregada correctamente");
    } catch (error: any) {
      console.log("ERROR", error);
      toastHandler(TOAST_TYPE.ERROR_TOAST, error.data.error);
    }
  };

  useEffect(() => {
    refetch();
  }, [refetch]);
  return (
    <>
      <div className="flex flex-col gap-4">
        <Suspense fallback={<Skeleton.Node active />}>
          {results.map((company) => (
            <CompanyCards
              companiesGroup={company}
              key={company.id}
              isLoading={isLoading || addLoading}
              showDeleteButtom={false}
              onClick={() => handleAddCompanyToGroup(company.id)}
            />
          ))}
        </Suspense>
        <Pagination
          align="center"
          total={85}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
          defaultPageSize={20}
          defaultCurrent={1}
        />
      </div>
    </>
  );
}
