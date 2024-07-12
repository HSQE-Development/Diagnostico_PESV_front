import { Comun } from "@/interfaces/Comun";
import { Table, TableColumnsType, TablePaginationConfig } from "antd";
import { SorterResult } from "antd/es/table/interface";
import React, { useState } from "react";
interface DataType extends Comun {
  key: React.Key;
}
interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<DataType>["field"];
  sortOrder?: SorterResult<DataType>["order"];
  filters?: Record<string, any>;
}
export default function DiagnosisDataTable() {
  const columns: TableColumnsType<DataType> = [
    {
      title: "CICLO (PHVA)",
      dataIndex: "name",
      showSorterTooltip: { target: "full-header" },
      sortDirections: ["descend"],
      width: 10,
    },
    {
      title: "PASO PESV",
      dataIndex: "name",
      showSorterTooltip: { target: "full-header" },
      sortDirections: ["descend"],
      width: 10,
    },
    {
      title: "Criterio de verificación",
      dataIndex: "name",
      showSorterTooltip: { target: "full-header" },
      sortDirections: ["descend"],
      width: "20rem",
    },
    {
      title: "Documento a verificar",
      dataIndex: "name",
      showSorterTooltip: { target: "full-header" },
      sortDirections: ["descend"],
    },
    {
      title: "Valor de la variable",
      dataIndex: "name",
      showSorterTooltip: { target: "full-header" },
      sortDirections: ["descend"],
      width: 10,
    },
    {
      title: "Valor Obtenido",
      dataIndex: "name",
      showSorterTooltip: { target: "full-header" },
      sortDirections: ["descend"],
      width: 10,
    },

    {
      title: "Observaciones",
      dataIndex: "name",
      showSorterTooltip: { target: "full-header" },
      sortDirections: ["descend"],
    },
    {
      title: "Nivel de cumplimiento",
      dataIndex: "name",
      fixed: "right",
    },
  ];
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  return (
    <Table
      columns={columns}
      pagination={tableParams.pagination}
      scroll={{ x: "max-content" }}
      showSorterTooltip={{ target: "sorter-icon" }}
      //@ts-ignore
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30"],
      }}
      size="small"
    />
  );
}
