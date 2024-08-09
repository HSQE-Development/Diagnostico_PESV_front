// import { Diagnosis } from "@/interfaces/Diagnosis";
import { DiagnosisItemList } from "@/Features/Companies/Components/CompanyDiagnosis";
import { Diagnosis } from "@/interfaces/Company";
import { Timeline } from "antd";
import { TimeLineItemProps } from "antd/es/timeline/TimelineItem";
import React, { useEffect, useState } from "react";

interface HistoryTimeLineProps {
  diagnosis: Diagnosis[];
}

export default function HistoryTimeLine({ diagnosis }: HistoryTimeLineProps) {
  const [items, setItems] = useState<TimeLineItemProps[]>([]);

  const sortedDiagnosis = [...diagnosis].sort((a, b) => {
    return a.is_finalized === b.is_finalized ? 0 : a.is_finalized ? 1 : -1;
  });
  useEffect(() => {
    if (diagnosis) {
      const newItems = sortedDiagnosis.map((d) => ({
        color: d.is_finalized ? "blue" : "red",
        children: <DiagnosisItemList diagnosis={d} />,
      }));

      setItems(newItems);
    }
  }, [diagnosis]);
  return (
    <>
      <Timeline className="w-2/3" mode="alternate" items={items} />
    </>
  );
}
