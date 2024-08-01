import { diagnosisService } from "@/stores/services/diagnosisServices";
import { Descriptions, DescriptionsProps, Table } from "antd";
import React from "react";

interface TotalTableProps {
  companyId: number;
}
export default function TotalTable({ companyId }: TotalTableProps) {
  const { data } = diagnosisService.useTableReportTotalQuery({ companyId });
  const columns = [
    {
      title: "Total Items",
      dataIndex: "totalItems",
      key: "totalItems",
    },
    {
      title: "CUMPLE",
      dataIndex: "compliance1",
      key: "compliance1",
    },
    {
      title: "NO CUMPLE",
      dataIndex: "compliance2",
      key: "compliance2",
    },
    {
      title: "CUMPLE PARCIALMENTE",
      dataIndex: "compliance3",
      key: "compliance3",
    },
    {
      title: "NO APLICA",
      dataIndex: "compliance4",
      key: "compliance4",
    },
    {
      title: "General",
      dataIndex: "general",
      key: "general",
      render: (text: any) => `${text} %`,
    },
  ];

  const tableData = [
    {
      key: "1",
      totalItems: data?.counts.reduce((acc, item) => acc + item.count, 0),
      compliance1: data?.counts.find((c) => c.compliance_id === 1)?.count || 0,
      compliance2: data?.counts.find((c) => c.compliance_id === 2)?.count || 0,
      compliance3: data?.counts.find((c) => c.compliance_id === 3)?.count || 0,
      compliance4: data?.counts.find((c) => c.compliance_id === 4)?.count || 0,
      general: data?.general,
    },
  ];
  return (
    <>
      <Table columns={columns} dataSource={tableData} pagination={false} />
    </>
  );
}
