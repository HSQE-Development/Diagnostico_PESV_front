import React from "react";
import CompanyInfo from "../CompanyInfo";
import DiagnosisDataTable from "../DiagnosisDataTable";
import { Progress, ProgressProps } from "antd";
import { useAppSelector } from "@/stores/hooks";

interface Props {
  companyId: number;
}
export default function DiagnosisForm({ companyId }: Props) {
  const conicColors: ProgressProps["strokeColor"] = {
    "0%": "#E0F7FA",
    "20%": "#B2EBF2",
    "40%": "#80DEEA",
    "60%": "#4DD0E1",
    "80%": "#26C6DA",
    "100%": "#00BCD4",
  };
  const percentageCompleted = useAppSelector(
    (state) => state.diagnosis.percentageCompleted
  );
  return (
    <div className="flex flex-1 justify-between items-start gap-4">
      <CompanyInfo companyId={companyId} />
      <div className="flex flex-col flex-1 w-2/4 relative">
        <div className="w-full sticky top-0 mb-4 z-50 bg-white p-4 ">
          <span>Conteo General</span>
          <Progress
            percent={percentageCompleted}
            type="line"
            strokeColor={conicColors}
            size={["100%", 5]}
          />
        </div>
        <DiagnosisDataTable companyId={companyId} />
      </div>
    </div>
  );
}
