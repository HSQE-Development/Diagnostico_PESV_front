import React from "react";
import { ResponsiveRadar } from "@nivo/radar";

interface ReportDiagnosisProps {
  companyId: number;
}
export default function ReportDiagnosis({ companyId }: ReportDiagnosisProps) {
  const data: any = [
    {
      taste: "PLANEAR",
      chardonay: 90,
      carmenere: 98,
      syrah: 115,
    },
    {
      taste: "HACER",
      chardonay: 10,
      carmenere: 95,
      syrah: 23,
    },
    {
      taste: "VERIFICAR",
      chardonay: 80,
      carmenere: 69,
      syrah: 25,
    },
    {
      taste: "ACTUAL",
      chardonay: 100,
      carmenere: 20,
      syrah: 10,
    },
  ];
  return (
    <>
      <div className="flex h-80">
        <ResponsiveRadar
          data={data}
          keys={["chardonay", "carmenere", "syrah"]}
          indexBy="taste"
          valueFormat=">-.2f"
          margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
          borderColor={{ from: "color" }}
          gridLabelOffset={36}
          dotSize={10}
          dotColor={{ theme: "background" }}
          dotBorderWidth={2}
          colors={{ scheme: "nivo" }}
          blendMode="multiply"
          motionConfig="wobbly"
          legends={[
            {
              anchor: "top-left",
              direction: "column",
              translateX: -50,
              translateY: -40,
              itemWidth: 80,
              itemHeight: 20,
              itemTextColor: "#999",
              symbolSize: 12,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#000",
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </>
  );
}
