import CompanyForm from "@/Features/Companies/Components/CompanyForm";
import { useModal } from "@/hooks/utilsHooks";
import { corporateGroupService } from "@/stores/services/corporateGroupService";
import { TOAST_TYPE, toastHandler } from "@/utils/useToast";
import { Button, Input, Modal, Pagination, Skeleton } from "antd";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { CiSaveDown1 } from "react-icons/ci";
interface CompanyListProps {
  corporateId: number;
}
const CompanyCards = lazy(() => import("./CompanyCards"));

export default function CompanyList({ corporateId }: CompanyListProps) {
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(2);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data, isLoading, refetch } =
    corporateGroupService.useFindCompaniesNotInCorporateQuery({
      corporate: corporateId,
      page: currentPage,
      page_size: pageSize,
      search: searchTerm,
    });

  const { isOpen, open, close } = useModal();

  const [addOrRemoveCompanyOfGroupByGroupId, { isLoading: addLoading }] =
    corporateGroupService.useAddOrRemoveCompanyOfGroupByGroupIdMutation();

  useEffect(() => {
    if (data) setTotal(data.count);
  }, [data]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to the first page when page size changes
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const results = Array.isArray(data?.results) ? data.results : [];

  const handleAddCompanyToGroup = async (companyId: number) => {
    try {
      await addOrRemoveCompanyOfGroupByGroupId({
        action: "add",
        company: companyId,
        group: corporateId,
      }).unwrap();
      toastHandler(TOAST_TYPE.SUCCESS_TOAST, "Empresa agregada correctamente");
    } catch (error: any) {
      console.log("ERROR", error);
      toastHandler(TOAST_TYPE.ERROR_TOAST, error.data.error);
    }
  };

  useEffect(() => {
    refetch();
  }, [refetch]);
  return (
    <>
      <div className="flex flex-col gap-4">
        <Button
          type="dashed"
          className="bg-purple-100 active:bg-purple-200 border-purple-400 hover:text-purple-700"
          onClick={open}
        >
          Caracterizar empresa
        </Button>
        <Input
          placeholder="Buscar por nombre o NIT"
          value={searchTerm}
          onChange={handleSearchChange}
          onPressEnter={() => refetch()} // Refrescar los resultados cuando se presiona Enter
        />
        <Suspense fallback={<Skeleton.Node active />}>
          {results.map((company) => (
            <CompanyCards
              companiesGroup={company}
              key={company.id}
              isLoading={isLoading || addLoading}
              showDeleteButtom={false}
              onClick={() => handleAddCompanyToGroup(company.id)}
            />
          ))}
        </Suspense>

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
      </div>

      <Modal
        title={
          <span className="flex items-center justify-start">
            {" "}
            <CiSaveDown1 className="mr-2" />
            Agregar Empresa
          </span>
        }
        centered
        open={isOpen}
        onOk={close}
        onCancel={close}
        width={1000}
        footer={null}
      >
        <CompanyForm onlyCreate={true} isUseOut={true} />
      </Modal>
    </>
  );
}
