import React from "react";
import FlotaVehicular from "../FlotaVehicular";
import CompanyInfo from "../CompanyInfo";

interface Props {
  companyId: number;
}
export default function QuantityForm({ companyId }: Props) {
  return (
    <div className="flex flex-1 justify-between items-start gap-4">
      <CompanyInfo companyId={companyId} />
      <div className="flex flex-col flex-1 w-2/4">
        <FlotaVehicular companyId={companyId} />
      </div>
    </div>
  );
}
