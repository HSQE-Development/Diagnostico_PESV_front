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

  const sortedDiagnosis = [...diagnosis].sort((a, b) => b.id - a.id);

  const highestId = Math.max(...sortedDiagnosis.map((d) => d.id));
  useEffect(() => {
    if (diagnosis) {
      const newItems = sortedDiagnosis.map((d) => ({
        color: d.id === highestId ? "red" : "blue",
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
