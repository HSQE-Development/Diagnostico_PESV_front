import React from "react";
import CompanyInfo from "../CompanyInfo";
import DiagnosisDataTable from "../DiagnosisDataTable";

interface Props {
  companyId: number;
}
export default function DiagnosisForm({ companyId }: Props) {
  return (
    <div className="flex flex-1 justify-between items-start gap-4">
      <CompanyInfo companyId={companyId} />
      <div className="flex flex-col flex-1 w-2/4">
        <DiagnosisDataTable />
      </div>
    </div>
  );
}
