import { diagnosisService } from "@/stores/services/diagnosisServices";
import { Table, TableColumnsType } from "antd";
import React, { useEffect, useState } from "react";
interface ReportTableProps {
  companyid: number;
}
export default function ReportTable({ companyid }: ReportTableProps) {
  const { data } = diagnosisService.useTableReportQuery({
    companyId: companyid,
  });

  const columns: TableColumnsType = [
    {
      title: "Fase",
      dataIndex: "cycle",
      key: "cycle",
      render: (_, record) =>
        record.cycle == "P" ? (
          <span className="text-white">PLANEAR</span>
        ) : record.cycle == "H" ? (
          <span className="text-white">HACER</span>
        ) : record.cycle == "V" ? (
          <span className="text-white">VERIFICAR</span>
        ) : (
          <span className="text-white">ACTUAR</span>
        ),
    },
    {
      title: "% Fase",
      dataIndex: "cycle_percentage",
      key: "cycle_percentage",
      render: (text: any) => (
        <span className="text-white">{`${Number(text.toFixed(2))} %`}</span>
      ),
    },
  ];

  const stepsColumns = [
    {
      title: "Paso",
      dataIndex: "step",
      key: "step",
    },
    {
      title: "Requerimiento",
      dataIndex: "requirement_name",
      key: "requirement_name",
    },
    {
      title: "% Paso",
      dataIndex: "percentage",
      key: "percentage",
      render: (text: any) => `${Number(text.toFixed(2))} %`,
    },
  ];

  const expandedRowRender = (record: any) => {
    const stepsData = record.steps.map((step: any) => ({
      key: step.step,
      step: step.step,
      requirement_name: step.requirements
        .map((req: any) => req.requirement_name)
        .join(", "),
      percentage: step.percentage,
    }));

    return (
      <Table
        columns={stepsColumns}
        dataSource={stepsData}
        pagination={false}
        showHeader={true}
        rowKey="step"
      />
    );
  };

  const tableData = data?.map((cycle: any, index: number) => ({
    key: index,
    cycle: cycle.cycle,
    cycle_percentage: cycle.cycle_percentage,
    steps: cycle.steps,
  }));
  return (
    <>
      <Table
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={tableData}
        pagination={false}
        rowKey="key"
        rowClassName={(record) =>
          record.cycle == "P"
            ? "bg-[#0066B2]"
            : record.cycle == "H"
            ? "bg-[#00A551]"
            : record.cycle == "V"
            ? "bg-[#DCB00A]"
            : "bg-[#EC1C24]"
        }
        rowHoverable={false}
      />
    </>
  );
}
