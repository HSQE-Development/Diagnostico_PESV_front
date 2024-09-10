import { Arl } from "@/interfaces/Arl";
import { setArls } from "@/stores/features/arlSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { arlService } from "@/stores/services/arlService";
import {
  Button,
  message,
  Modal,
  Popconfirm,
  Table,
  TableColumnsType,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline, MdEdit, MdOutlineBusiness } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ArlForm from "./ArlForm";
import useArl from "@/hooks/arlHooks";
import { encryptId } from "@/utils/utilsMethods";
import { default as CompanyDataTable } from "@/Features/Companies/Components/DataTable";

interface DataType extends Arl {
  key: React.Key;
}
export default function DataTable() {
  const navigate = useNavigate();
  const { data: fetchArls, refetch, isLoading } = arlService.useFindAllQuery();
  const dispatch = useAppDispatch();
  const { deleteArlById, isDeleting } = useArl();

  useEffect(() => {
    /**
     * Este Useffect se ejecuta cada que se reenderiza el componente, para mantener la data actualizada
     *
     */
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (fetchArls) {
      dispatch(setArls(fetchArls));
    }
  }, [fetchArls, dispatch]);

  const arls = useAppSelector((state) => state.arls.arls);

  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    arlId: number;
  }>({
    isOpen: false,
    arlId: 0 as number,
  });
  const [showCompanies, setShowCompanies] = useState<{
    isOpen: boolean;
    arlId: number;
  }>({
    isOpen: false,
    arlId: 0 as number,
  });
  const handleEditModal = (id: number) => {
    setEditModal({
      isOpen: true,
      arlId: id,
    });
  };

  const confirm = async (id: number) => {
    const hideLoadingMessage = message.loading("Eliminando..", 0);
    try {
      await deleteArlById(id);
      message.success("Compañía eliminada exitosamente");
    } catch (error: any) {
      message.error(
        error.data?.error || "Ocurrió un error al eliminar la compañía"
      );
    } finally {
      hideLoadingMessage();
    }
  };

  const columns: TableColumnsType<DataType> = [
    { title: "Nombre ARL", dataIndex: "name" },
    {
      title: "Acciones",
      key: "Operation",
      fixed: "right",
      width: 1,
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <div className=" flex items-center justify-start gap-2">
            <Tooltip title="Empresas de esta Arl">
              <Button
                icon={<MdOutlineBusiness />}
                onClick={() =>
                  navigate(
                    `/app/companies?idArl=${encryptId(record.id.toString())}`
                  )
                }
              />
            </Tooltip>
            <Tooltip title="Empresas de esta Arl">
              <Button
                icon={<MdOutlineBusiness />}
                onClick={() => {
                  setShowCompanies({
                    isOpen: true,
                    arlId: record.id,
                  });
                }}
              />
            </Tooltip>
            <Button
              icon={<CiEdit />}
              onClick={() => handleEditModal(record.id)}
            />
            <Popconfirm
              title="Eliminar Empresa"
              description="Estas seguro de eliminar esta empresa?"
              onConfirm={async () => await confirm(record.id)}
              onCancel={() => null}
              okText="Eliminar"
              cancelText="No"
            >
              <Button loading={isDeleting} danger icon={<MdDeleteOutline />} />
            </Popconfirm>
          </div>
        ) : null,
    },
  ];

  const dataSource = arls.map((arl: Arl) => ({
    ...arl,
    key: arl.id, // Utilizando el ID como clave única
  }));
  return (
    <>
      <Table
        size="small"
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: "max-content" }}
        showSorterTooltip={{ target: "sorter-icon" }}
        loading={isLoading}
        //@ts-ignore
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "50", "100"],
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
        onCancel={() => setEditModal({ isOpen: false, arlId: 0 })}
        // width={1000}
        footer={<></>}
      >
        <ArlForm id={editModal.arlId} />
      </Modal>
      <Modal
        title={
          <span className="flex items-center justify-start">
            {" "}
            <MdEdit className="mr-2" />
            Empresas con esta ARL
          </span>
        }
        centered
        open={showCompanies.isOpen}
        onCancel={() => setShowCompanies({ isOpen: false, arlId: 0 })}
        width={1000}
        footer={<></>}
      >
        <CompanyDataTable arlIdProp={showCompanies.arlId} onlyInfo />
      </Modal>
    </>
  );
}
