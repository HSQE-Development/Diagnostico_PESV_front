import {
  Button,
  Collapse,
  CollapseProps,
  Empty,
  message,
  Modal,
  Pagination,
  Popover,
  Skeleton,
} from "antd";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { SlArrowDown } from "react-icons/sl";
import { FaLayerGroup } from "react-icons/fa";
import CompanyList from "./CompanyList";
import { corporateGroupService } from "@/stores/services/corporateGroupService";
import { CorporateGroupPagination } from "@/interfaces/CorporateGroup";
import {
  encryptId,
  generateColorStyles,
  getRandomColorClassForText,
} from "@/utils/utilsMethods";
import { IoMdAdd } from "react-icons/io";
import { TOAST_TYPE, toastHandler } from "@/utils/useToast";
import { useModal } from "@/hooks/utilsHooks";
import QuantityForm from "@/Features/Diagnosis/Components/Steps/QuantityForm";
import { MdOutlineAccountTree } from "react-icons/md";
import { diagnosisService } from "@/stores/services/diagnosisServices";
import { useNavigate } from "react-router-dom";
import { useCorporate } from "@/context/CorporateGroupContext";
const CompanyCards = lazy(() => import("./CompanyCards"));

const useAddOrRemoveCompany = () => {
  const [addOrRemoveCompanyOfGroupByGroupId, { isLoading: removeLoading }] =
    corporateGroupService.useAddOrRemoveCompanyOfGroupByGroupIdMutation();
  return { addOrRemoveCompanyOfGroupByGroupId, removeLoading };
};

const getItems = (
  data: CorporateGroupPagination,
  defaultClasses: string,
  handleAddCompanyToGroup: (companyId: number, groupId: number) => void,
  removeLoading: boolean,
  onOpenCard: () => void,
  setCompanyId: (id: number) => void,
  setCorporateId: (id: number) => void,
  handleInitDiagnosis: (id: number) => void,
  initLoading: boolean
): CollapseProps["items"] => {
  return data.results.map((group, index) => {
    // Generar un color aleatorio para cada grupo
    const baseColor = getRandomColorClassForText();
    const { textColor, bgColor } = generateColorStyles(baseColor);

    return {
      key: index.toString(), // o usa un identificador único si tienes
      label: (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <FaLayerGroup className={`${textColor} text-xl mr-2`} />
              <span>{group.name}</span>
            </div>
          </div>
        </>
      ),
      children: (
        <>
          <form className="flex flex-col items-start justify-around w-full">
            <div className="flex items-center justify-between w-full my-2">
              <Button
                type="primary"
                onClick={() => handleInitDiagnosis(group.id)}
                loading={initLoading}
                disabled={group.company_diagnoses_corporate.length <= 0}
              >
                Empezar Diagnostico
              </Button>
              <Popover
                placement="right"
                content={<CompanyList corporateId={group.id} />}
                title="Añadir Empresa al grupo"
                trigger="click"
              >
                <Button type="primary" icon={<IoMdAdd />}></Button>
              </Popover>
            </div>
            <div className="grid  w-full gap-4 grid-cols-12">
              {group.company_diagnoses_corporate.length <= 0 && (
                <Empty
                  className="col-span-12"
                  description="No hay empresas asignadas a este grupo"
                />
              )}
              <Suspense fallback={<Skeleton.Node active />}>
                {group.company_diagnoses_corporate.map((companies) => (
                  <CompanyCards
                    companiesGroup={companies.company_detail}
                    key={companies.company_detail.id}
                    onDeleteClick={() =>
                      handleAddCompanyToGroup(
                        companies.company_detail.id,
                        group.id
                      )
                    }
                    isLoading={removeLoading}
                    onClick={() => {
                      onOpenCard();
                      setCorporateId(group.id);
                    }}
                    setCompanyId={setCompanyId}
                  />
                ))}
              </Suspense>
            </div>
          </form>
        </>
      ),
      className: `rounded-2xl my-2 ${defaultClasses} ${bgColor}`,
    };
  });
};

export default function DataDisplay() {
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const { data, refetch, isLoading } = corporateGroupService.useFindAllQuery({
    page: currentPage,
    page_size: pageSize,
  });
  const [companyId, setCompanyId] = useState<number>(0);
  // const [corporateId, setCorporateId] = useState<number>(0);
  const { setCorporateId } = useCorporate();

  const handleSetCompanyId = (id: number) => {
    setCompanyId(id);
  };
  const { isOpen, open, close } = useModal();

  useEffect(() => {
    if (data) setTotal(data.count);
  }, [data]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to the first page when page size changes
  };

  const { addOrRemoveCompanyOfGroupByGroupId, removeLoading } =
    useAddOrRemoveCompany();

  const handleAddCompanyToGroup = async (
    companyId: number,
    groupId: number
  ) => {
    try {
      await addOrRemoveCompanyOfGroupByGroupId({
        action: "delete", // Ajusta según la acción que desees realizar
        company: companyId,
        group: groupId,
      }).unwrap();
      toastHandler(
        TOAST_TYPE.SUCCESS_TOAST,
        "Empresa actualizada correctamente"
      );
    } catch (error: any) {
      console.log("ERROR", error);
      toastHandler(
        TOAST_TYPE.ERROR_TOAST,
        error.data?.error || "Error desconocido"
      );
    }
  };

  const [initDiagnosisCorporate, { isLoading: initLoading }] =
    diagnosisService.useInitDiagnosisCorporateMutation();

  const navigate = useNavigate();

  const handleInitDiagnosis = async (group_id: number) => {
    try {
      const data = await initDiagnosisCorporate({
        corporate: group_id,
      }).unwrap();
      setCorporateId(group_id);
      navigate(
        `/app/companies/diagnosis/${encryptId("0")}/?diagnosis=${encryptId(
          data.id.toString()
        )}&corporate=${encryptId(group_id.toString())}`
      );
    } catch (error: any) {
      console.log(error);
      message.error(
        "Error interno del sistema, comuniquese con un Administrador"
      );
    }
  };
  return (
    <>
      {isLoading && <Skeleton avatar paragraph={{ rows: 4 }} active />}
      {data && (
        <Collapse
          size="small"
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => (
            <SlArrowDown
              className={`text-center items-center ${
                isActive ? "rotate-180" : "rotate-0"
              }`}
            />
          )}
          items={getItems(
            data,
            "hover:bg-slate-50 transition-all",
            handleAddCompanyToGroup,
            removeLoading,
            open,
            handleSetCompanyId,
            setCorporateId,
            handleInitDiagnosis,
            initLoading
          )}
          className="md:mx-8 custom_collapsed mb-8"
          collapsible="icon"
        />
      )}

      <Pagination
        align="center"
        current={currentPage}
        total={total}
        pageSize={pageSize}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
        onShowSizeChange={handlePageSizeChange}
        onChange={handlePageChange}
      />

      <Modal
        title={
          <span className="flex items-center justify-start">
            {" "}
            <MdOutlineAccountTree className="mr-2" />
            Conteo de empresa
          </span>
        }
        centered
        open={isOpen}
        onOk={close}
        onCancel={close}
        width={1300}
        footer={null}
      >
        <QuantityForm companyId={companyId} isOver={true} />
      </Modal>
    </>
  );
}
