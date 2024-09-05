import { ComplianceTrendData } from "@/interfaces/Charts";
import { diagnosisService } from "@/stores/services/diagnosisServices";
import { ResponsiveLine } from "@nivo/line";
import React, { useEffect, useState } from "react";

export default function ChecklistTrendChart() {
  const [formattedData, setFormattedData] = useState<any[]>([
    {
      id: "No hay datos",
      data: [
        {
          x: " 0",
          y: "0",
        },
      ],
    },
  ]);
  const { data } = diagnosisService.useComplianceTrendQuery();

  useEffect(() => {
    if (data) {
      if (data.length <= 0) {
        setFormattedData([
          {
            id: "No hay datos",
            data: [
              {
                x: " 0",
                y: "0",
              },
            ],
          },
        ]);
      } else {
        const formatted = [
          {
            id: "Fullfillment Percentage",
            data: data.map((item: ComplianceTrendData) => ({
              x: item.date || "N/A", // Valor predeterminado para x si es undefined o null
              y:
                item.fulfilled_percentage !== undefined &&
                item.fulfilled_percentage !== null
                  ? item.fulfilled_percentage
                  : 0, // Valor predeterminado para y si es undefined o null
            })),
          },
        ];
        setFormattedData(formatted);
      }
    }
  }, [data]);
  return (
    <div
      style={{ height: 300 }}
      className="flex items-center justify-center w-full"
    >
      <ResponsiveLine
        data={formattedData}
        curve="natural" // Define la curva como lineal para eliminar la tensión
        margin={{ top: 20, right: 20, bottom: 60, left: 50 }}
        xScale={{
          type: "point", // Usa "time" si x es una fecha
        }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Fecha",
          legendOffset: 36,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Diagnosticos realizados",
          legendOffset: -40,
          format: (value) => Math.round(value), // Redondear los valores del eje Y
        }}
        colors={{ scheme: "purple_orange" }}
        lineWidth={2}
        pointSize={6}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        enablePointLabel={true}
        pointLabel="y"
        pointLabelYOffset={-12}
        useMesh={true}
      />
    </div>
  );
}
