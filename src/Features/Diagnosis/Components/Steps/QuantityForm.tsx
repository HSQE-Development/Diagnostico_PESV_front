import React from "react";
import FlotaVehicular from "../FlotaVehicular";
import CompanyInfo from "../CompanyInfo";

interface Props {
  companyId: number;
  corporate_id?: number;
  isOver?: boolean; //Para cuando se usa el componente por fuera osea solo para hacer el conteo del pesv
}
export default function QuantityForm({
  companyId,
  corporate_id,
  isOver = false,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row flex-1 justify-between items-start gap-4">
      <CompanyInfo
        companyId={companyId}
        isOutOfContext={isOver}
        corporate_id={corporate_id}
      />
      <div className="flex flex-col flex-1 w-full md:w-2/4">
        <FlotaVehicular companyId={companyId} cancelFetch={isOver} />
      </div>
    </div>
  );
}
