import React, { useEffect, useState } from "react";
import { ResponsiveRadar } from "@nivo/radar";
import { diagnosisService } from "@/stores/services/diagnosisServices";
import { useSearchParams } from "react-router-dom";
import { decryptId } from "@/utils/utilsMethods";

interface ReportDiagnosisProps {
  companyId: number;
}
export default function ReportDiagnosis({ companyId }: ReportDiagnosisProps) {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [searchParams] = useSearchParams();
  const diagnosisParam = searchParams.get("diagnosis");
  const diagnosisId = diagnosisParam
    ? parseInt(decryptId(diagnosisParam))
    : undefined;

  const { data: fetchRadar } = diagnosisService.useRadarChartQuery({
    companyId,
    diagnosisId: diagnosisId ?? 0,
  });

  const typesCycle = {
    P: "PLANEAR",
    H: "HACER",
    V: "VERIFICAR",
    A: "ACTUAR",
  };

  useEffect(() => {
    if (fetchRadar) {
      const transformedData = fetchRadar.map((radar) => ({
        cycle: typesCycle[radar.cycle.toUpperCase() as keyof typeof typesCycle],
        porcentage: radar.cycle_percentage,
      })) as Record<string, unknown>[];
      setData(transformedData);
    }
  }, [companyId, fetchRadar]);
  return (
    <>
      <div className="flex h-[27rem] w-full">
        <ResponsiveRadar
          data={data}
          keys={["porcentage"]}
          indexBy="cycle"
          maxValue="auto"
          margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
          curve="linearClosed"
          borderWidth={2}
          borderColor={{ from: "color" }}
          gridLabelOffset={36}
          dotSize={10}
          dotColor={{ theme: "background" }}
          dotBorderWidth={2}
          dotBorderColor={{ from: "color" }}
          colors={"#0066B2"}
          fillOpacity={0.25}
          blendMode="multiply"
          animate={true}
          motionConfig="wobbly"
        />
      </div>
    </>
  );
}
