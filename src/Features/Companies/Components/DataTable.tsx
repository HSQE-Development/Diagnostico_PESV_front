import { Company, Diagnosis } from "@/interfaces/Company";
import { setCompanies, setDeleteCompany } from "@/stores/features/companySlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { companyService } from "@/stores/services/companyService";
import {
  Badge,
  Button,
  ConfigProvider,
  Input,
  InputRef,
  message,
  Modal,
  Popconfirm,
  Popover,
  Space,
  Steps,
  Table,
  TableColumnsType,
  TableColumnType,
  TablePaginationConfig,
  TableProps,
  Tag,
  Tooltip,
} from "antd";
import { FilterDropdownProps, SorterResult } from "antd/es/table/interface";
import React, { useEffect, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import {
  MdDeleteOutline,
  MdEdit,
  MdOutlineDocumentScanner,
} from "react-icons/md";
import CompanyForm from "./CompanyForm";
import InfoConsultors from "@/Features/Companies/Components/InfoProfile";
import { useNavigate } from "react-router-dom";
import { decryptId, encryptId, formatNIT } from "@/utils/utilsMethods";
import { BiSearch } from "react-icons/bi";
//@ts-ignore
import Highlighter from "react-highlight-words";
import { IoDocumentAttach } from "react-icons/io5";
import CompanyDiagnosis from "./CompanyDiagnosis";
interface DataType extends Company {
  key: React.Key;
}
type DataIndex = keyof DataType;
interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<DataType>["field"];
  sortOrder?: SorterResult<DataType>["order"];
  filters?: Record<string, any>;
}

interface DataTableProps {
  arlIdProp?: number;
  onlyInfo?: boolean;
}

export default function DataTable({ arlIdProp, onlyInfo }: DataTableProps) {
  const navigate = useNavigate();
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const dispatch = useAppDispatch();
  const params = new URLSearchParams(window.location.search);
  const arlIdQueryParam = params.get("idArl");
  const arlIdFromQueryParam = parseInt(decryptId(arlIdQueryParam ?? ""));
  const arlIdToUse =
    arlIdProp !== undefined
      ? arlIdProp
      : isNaN(arlIdFromQueryParam)
      ? undefined
      : arlIdFromQueryParam;
  // const [messageApi, contextHolder] = message.useMessage();
  const { data: fetchCompanies, isLoading } = companyService.useFindAllQuery({
    arlId: arlIdToUse,
  });
  const [openPopupDiagnosis, setOpenPopupDiagnosis] = useState<boolean>(false);

  useEffect(() => {
    if (fetchCompanies) {
      dispatch(setCompanies(fetchCompanies));
    }
  }, [fetchCompanies, dispatch, arlIdToUse]);

  const companies = useAppSelector((state) => state.company.companies);
  const [deleteCompany] = companyService.useDeleteCompanyMutation();
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    companyId: number;
  }>({
    isOpen: false,
    companyId: 0 as number,
  });

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<BiSearch />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <BiSearch style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record): any => {
      return record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase());
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

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

  const items = [
    {
      title: "Paso 1",
      description: "Conteo",
      icon: <MdOutlineDocumentScanner />,
    },
    {
      title: "Paso 2",
      description: "Lista de Verificación",
    },
    {
      title: "Paso 3",
      description: "Plan de Trabajo",
    },
  ];

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
      ...getColumnSearchProps("nit"),
      render: (text) => formatNIT(text),
    },
    {
      title: "Misionalidad",
      dataIndex: ["mission_detail", "name"],
    },
    {
      title: "Tamaño",
      dataIndex: ["company_size_detail", "name"],
      render: (_, record) => (
        <Popover
          placement="topLeft"
          title={record.misionality_size_criteria?.map(
            (cri) => cri.criteria_detail.name
          )}
        >
          <span>
            {record.size_detail?.name ?? (
              <Badge count="Por definirse" status="default" />
            )}
          </span>
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
      width: 410,
      render: (_, record) => {
        const ciiusDetail = record.ciius_detail || [];
        const maxVisible = 1; // Número máximo de elementos visibles
        const visibleCiius = ciiusDetail.slice(0, maxVisible);
        const hiddenCiius = ciiusDetail.slice(maxVisible);
        return (
          <div className="flex flex-wrap w-[100%]">
            {visibleCiius.map((ciiu) => (
              <Tag
                key={ciiu.id}
                className="w-auto whitespace-normal inline-block"
              >
                <span className="font-bold">{ciiu.code}</span>-{ciiu.name}
              </Tag>
            ))}
            {hiddenCiius.length > 0 && (
              <Popover
                className="!max-w-28"
                content={() => (
                  <>
                    {hiddenCiius.map((ciiu) => (
                      <>
                        <div className="flex flex-wrap">
                          <Tag
                            key={ciiu.id}
                            className="whitespace-normal inline-block"
                          >
                            {ciiu.code}-{ciiu.name}
                          </Tag>
                        </div>
                      </>
                    ))}
                  </>
                )}
                title="Más detalles"
                trigger="click"
              >
                <Button type="link">Ver más ({hiddenCiius.length})</Button>
              </Popover>
            )}
          </div>
        );
      },
    },
    {
      title: "Arl a la que pertenece",
      dataIndex: ["arl_detail", "name"],
      // fixed: "right",
      className: `${onlyInfo ? "relative hidden" : ""}`,
    },
    {
      title: "Diagnosticos",
      fixed: "right",
      render: (_, record, i) => {
        return (
          <>
            <div className="flex items-center justify-center">
              <Popover
                content={
                  <CompanyDiagnosis
                    diagnosis={record.company_diagnosis}
                    companyid={record.id}
                  />
                }
                title="Diagnosticos realizados"
                trigger="click"
                placement="left"
              >
                <Button
                  key={i}
                  disabled={record.company_diagnosis.length <= 0}
                  icon={<IoDocumentAttach />}
                ></Button>
              </Popover>
            </div>
          </>
        );
      },
    },
    // {
    //   title: "Consultor Asignado",
    //   dataIndex: ["consultor_detail", "username"],
    //   render: (_, record) =>
    //     record.consultor_detail != null ? (
    //       <InfoConsultors consultand={record.consultor_detail} />
    //     ) : (
    //       <span>SIN CONSULTOR ASIGNADO</span>
    //     ),
    //   fixed: "right",
    // },
    // {
    //   title: "Diagnostico",
    //   fixed: "right",
    //   render: (_, record) => {
    //     return (
    //       <Steps type="inline" current={record.diagnosis_step} items={items} />
    //     );
    //   },
    // },
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
                    )}?newDiagnosis=true`
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
      <ConfigProvider
        theme={{
          components: {
            Table: {
              /* here is your component tokens */
              headerBg: "#F6F8FA",
              headerBorderRadius: 12,
            },
          },
        }}
      >
        <Table
          size="small"
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
      </ConfigProvider>
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
