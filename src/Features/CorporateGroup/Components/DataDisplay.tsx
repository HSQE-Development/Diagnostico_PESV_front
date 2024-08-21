import {
  Button,
  Collapse,
  CollapseProps,
  Pagination,
  Popover,
  Skeleton,
} from "antd";
import React, { useEffect, useState } from "react";
import { SlArrowDown } from "react-icons/sl";
import CompanyCards from "./CompanyCards";
import { FaLayerGroup } from "react-icons/fa";
import CompanyList from "./CompanyList";
import { corporateGroupService } from "@/stores/services/corporateGroupService";
import { CorporateGroupPagination } from "@/interfaces/CorporateGroup";
import {
  generateColorStyles,
  getRandomColorClassForText,
} from "@/utils/utilsMethods";
import { IoMdAdd } from "react-icons/io";

const getItems = (
  data: CorporateGroupPagination,
  defaultClasses: string
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
            {/* <Button
              type="primary"
              className={`bg-${baseColor} ${hoverColor} ${activeColor}`}
            >
              Empezar Diagnostico
            </Button> */}
          </div>
        </>
      ),
      children: (
        <>
          <div className="flex flex-col items-start justify-around w-full">
            <div className="flex items-center justify-end w-full my-2">
              <Popover
                placement="right"
                content={<CompanyList />}
                title="Añadir Empresa al grupo"
                trigger="click"
              >
                <Button type="primary" icon={<IoMdAdd />}></Button>
              </Popover>
            </div>
            <div className="grid  w-full gap-4 grid-cols-12">
              {group.company_diagnoses_corporate.map((companies) => (
                <CompanyCards companiesGroup={companies.company_detail} />
              ))}
            </div>
          </div>
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

  useEffect(() => {
    if (data) setTotal(data.count);
  }, [data]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (current: number, size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to the first page when page size changes
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
          items={getItems(data, "hover:bg-slate-50 transition-all")}
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
    </>
  );
}
