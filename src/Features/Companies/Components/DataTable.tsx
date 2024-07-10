import { Company } from "@/interfaces/Company";
import { setCompanies, setDeleteCompany } from "@/stores/features/companySlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { companyService } from "@/stores/services/companyService";
import {
  Button,
  message,
  Modal,
  Popconfirm,
  Popover,
  Table,
  TableColumnsType,
  TablePaginationConfig,
  TableProps,
  Tooltip,
} from "antd";
import { SorterResult } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import {
  MdDeleteOutline,
  MdEdit,
  MdOutlineDocumentScanner,
} from "react-icons/md";
import CompanyForm from "./CompanyForm";
import InfoConsultors from "@/Features/Companies/Components/InfoProfile";
import { useNavigate } from "react-router-dom";
import { encryptId } from "@/utils/utilsMethods";

interface DataType extends Company {
  key: React.Key;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<DataType>["field"];
  sortOrder?: SorterResult<DataType>["order"];
  filters?: Record<string, any>;
}

export default function DataTable() {
  const navigate = useNavigate();

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  // const [messageApi, contextHolder] = message.useMessage();
  const {
    data: fetchCompanies,
    refetch,
    isLoading,
  } = companyService.useFindAllQuery();
  const dispatch = useAppDispatch();
  const companies = useAppSelector((state) => state.company.companies);
  const [deleteCompany] = companyService.useDeleteCompanyMutation();
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    companyId: number;
  }>({
    isOpen: false,
    companyId: 0 as number,
  });

  useEffect(() => {
    /**
     * Este Useffect se ejecuta cada que se reenderiza el componente, para mantener la data actualizada
     *
     */
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (fetchCompanies) {
      dispatch(setCompanies(fetchCompanies));
    }
  }, [fetchCompanies, dispatch]);

  const confirm = async (key: React.Key) => {
    // Mostrar mensaje de carga
    const hideLoadingMessage = message.loading("Eliminando..", 0);
    try {
      // Intentar eliminar la compañía
      const deletedCompany = await deleteCompany({
        id: parseInt(key.toString()),
      }).unwrap();
      // Despachar la acción para eliminar la compañía del estado
      dispatch(setDeleteCompany(deletedCompany.id));
      // Mostrar mensaje de éxito
      message.success("Compañía eliminada exitosamente");
    } catch (error: any) {
      // Mostrar mensaje de error
      message.error(
        error.data?.error || "Ocurrió un error al eliminar la compañía"
      );
    } finally {
      // Destruir el mensaje de carga
      hideLoadingMessage();
    }
  };

  const handleEditModal = (key: React.Key) => {
    setEditModal({
      isOpen: true,
      companyId: parseInt(key.toString()),
    });
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "Nombre Empresa",
      dataIndex: "name",
      showSorterTooltip: { target: "full-header" },
      onFilter: (value, record) => record.name.indexOf(value as string) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Nit",
      dataIndex: "nit",
    },
    {
      title: "Dedicación",
      dataIndex: ["dedication_detail", "name"],
    },
    {
      title: "Tamaño",
      dataIndex: ["company_size_detail", "name"],
      render: (_, record) => (
        <Popover
          placement="topLeft"
          title={record.company_size_detail.description}
        >
          <span>{record.company_size_detail.name}</span>
        </Popover>
      ),
    },
    {
      title: "Segmento",
      dataIndex: ["segment_detail", "name"], // Utilizando acceso profundo
    },
    {
      title: "Contacto",
      dataIndex: "dependant",
    },
    {
      title: "Número de contacto",
      dataIndex: "dependant_phone",
    },
    {
      title: "Actividades CIIU",
      dataIndex: "activities_ciiu",
    },
    {
      title: "Diagnosticos",
      dataIndex: "diagnosis",
    },
    {
      title: "Consultor Asignado",
      dataIndex: ["consultor_detail", "username"],
      render: (_, record) =>
        record.consultor_detail != null ? (
          <InfoConsultors consultand={record.consultor_detail} />
        ) : (
          <span>SIN CONSULTOR ASIGNADO</span>
        ),
      fixed: "right",
    },
    {
      title: "Acciones",
      key: "Operation",
      fixed: "right",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <div className=" flex items-center justify-center gap-2">
            <Tooltip title="Comenzar Diagnostico para esta empresa">
              <Button
                icon={<MdOutlineDocumentScanner />}
                onClick={() =>
                  navigate(
                    `/app/companies/diagnosis/${encryptId(
                      record.id.toString()
                    )}`
                  )
                }
              />
            </Tooltip>
            <Button
              icon={<CiEdit />}
              onClick={() => handleEditModal(record.key)}
            />
            <Popconfirm
              title="Eliminar Empresa"
              description="Estas seguro de eliminar esta empresa?"
              onConfirm={async () => await confirm(record.key)}
              onCancel={() => null}
              okText="Eliminar"
              cancelText="No"
            >
              <Button danger icon={<MdDeleteOutline />} />
            </Popconfirm>
          </div>
        ) : null,
    },
  ];

  const handleTableChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    const isMultipleSort = Array.isArray(sorter);
    setTableParams({
      pagination,
      filters,
      sortOrder: isMultipleSort ? undefined : sorter.order,
      sortField: isMultipleSort ? undefined : sorter.field,
    });
  };

  const dataSource = companies.map((company: Company) => ({
    ...company,
    key: company.id, // Utilizando el ID como clave única
  }));

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
        scroll={{ x: "max-content" }}
        showSorterTooltip={{ target: "sorter-icon" }}
        loading={isLoading}
        //@ts-ignore
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30"],
        }}
      />
      <Modal
        title={
          <span className="flex items-center justify-start">
            {" "}
            <MdEdit className="mr-2" />
            Editar Empresa
          </span>
        }
        centered
        open={editModal.isOpen}
        onCancel={() => setEditModal({ isOpen: false, companyId: 0 })}
        width={1000}
        footer={<></>}
      >
        <CompanyForm id={editModal.companyId} />
      </Modal>
    </>
  );
}
