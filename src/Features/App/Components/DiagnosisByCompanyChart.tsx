import { companyService } from "@/stores/services/companyService";
import { ResponsiveBar } from "@nivo/bar";
import React, { useEffect, useState } from "react";

export default function DiagnosisByCompanyChart() {
  const [formattedData, setFormattedData] = useState<any[]>([]);
  const { data } = companyService.useDiagnosisByCompanyQuery();

  useEffect(() => {
    if (data) {
      const formatted = data.map((item: any) => ({
        company: item.name,
        total_diagnostics: item.total_diagnostics,
        finalized_diagnostics: item.finalized_diagnostics,
        in_progress_diagnostics: item.in_progress_diagnostics,
      }));
      setFormattedData(formatted);
    }
  }, [data]);
  return (
    <div
      style={{ height: 300 }}
      className="flex items-center justify-center w-full"
    >
      <ResponsiveBar
        data={formattedData}
        keys={[
          "total_diagnostics",
          "finalized_diagnostics",
          "in_progress_diagnostics",
        ]}
        indexBy="company"
        margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
        padding={0.3}
        colors={{ scheme: "nivo" }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Company",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Number of Diagnostics",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      />
    </div>
  );
}
