import { ComplianceTrendData } from "@/interfaces/Charts";
import { diagnosisService } from "@/stores/services/diagnosisServices";
import { ResponsiveLine } from "@nivo/line";
import React, { useEffect, useState } from "react";

export default function ChecklistTrendChart() {
  const [formattedData, setFormattedData] = useState<any[]>([]);
  const { data } = diagnosisService.useComplianceTrendQuery();

  useEffect(() => {
    if (data) {
      const formatted = [
        {
          id: "Fullfillment Percentage",
          data: data.map((item: ComplianceTrendData) => ({
            x: item.date,
            y: item.fulfilled_percentage,
          })),
        },
      ];
      setFormattedData(formatted);
    }
  }, [data]);
  return (
    <div
      style={{ height: 300 }}
      className="flex items-center justify-center w-full"
    >
      <ResponsiveLine
        data={formattedData}
        margin={{ top: 20, right: 20, bottom: 60, left: 50 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: 0, max: 100 }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Date",
          legendOffset: 36,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Fulfillment Percentage",
          legendOffset: -40,
        }}
        colors={{ scheme: "nivo" }}
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
