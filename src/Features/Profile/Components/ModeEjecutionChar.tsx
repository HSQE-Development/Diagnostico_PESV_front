import { useAppSelector } from "@/stores/hooks";
import { diagnosisService } from "@/stores/services/diagnosisServices";
import { ResponsivePie } from "@nivo/pie";
import React from "react";

export default function ModeEjecutionChar() {
  const authUser = useAppSelector((state) => state.auth.authUser);

  const { data } =
    diagnosisService.useCountDiagnosisByConsultorByModeEjecutionQuery({
      consultor_id: authUser?.user.id ?? 0,
    });

  const formattedData = data
    ? data.map((item: any) => ({
        id: item.mode_ejecution,
        label: item.mode_ejecution,
        value: item.total,
      }))
    : [];
  return (
    <div style={{ height: 300 }} className="flex items-center justify-center">
      <ResponsivePie
        data={formattedData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={{ scheme: "nivo" }}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
}
