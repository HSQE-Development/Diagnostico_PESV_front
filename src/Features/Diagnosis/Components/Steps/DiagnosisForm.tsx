import React, { useEffect, useState } from "react";
import CompanyInfo from "../CompanyInfo";
import DiagnosisDataTable from "../DiagnosisDataTable";
import { Progress, ProgressProps } from "antd";
import { useAppSelector } from "@/stores/hooks";
import { ColorPalette, CorporateGroupId } from "@/interfaces/Comun";
import { getColorByLevelPesv } from "@/utils/utilsMethods";

interface Props extends CorporateGroupId {
  companyId: number;
}
export default function DiagnosisForm({ companyId }: Props) {
  const [colorBg, setColorBg] = useState<ColorPalette>({
    hex: "",
    tailwind: "",
  });

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
  const diagnosisDataStore = useAppSelector(
    (state) => state.diagnosis.diagnosis
  );

  useEffect(() => {
    // Verificar si diagnosisDataStore y type_detail están disponibles
    if (diagnosisDataStore?.type_detail?.id) {
      // Obtener el color basado en el id de type_detail
      const color = getColorByLevelPesv(diagnosisDataStore.type_detail.id);
      setColorBg(color);
    }
  }, [diagnosisDataStore]);
  return (
    <div className="flex flex-col md:flex-row flex-1 justify-between items-start gap-4">
      <CompanyInfo companyId={companyId} />
      <div className="flex flex-col flex-1 w-full md:w-2/4 relative">
        <div className="w-full sticky top-0 mb-4 z-50 bg-white p-4 ">
          <span className="flex gap-4 justify-between items-center">
            Conteo General
            <span
              className={`py-0 rounded-md px-2 text-white ${colorBg.tailwind}`}
            >
              {diagnosisDataStore?.type_detail?.name}
            </span>
          </span>
          <Progress
            percent={percentageCompleted}
            type="line"
            strokeColor={conicColors}
            size={["100%", 5]}
            aria-label="Progress PESV"
          />
        </div>
        <DiagnosisDataTable companyId={companyId} />
      </div>
    </div>
  );
}
