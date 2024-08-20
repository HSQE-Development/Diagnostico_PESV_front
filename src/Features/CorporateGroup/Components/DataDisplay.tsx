import { Button, Collapse, CollapseProps, Pagination, Popover } from "antd";
import React from "react";
import { SlArrowDown } from "react-icons/sl";
import CompanyCards from "./CompanyCards";
import { FaLayerGroup } from "react-icons/fa";
import CompanyList from "./CompanyList";
import { IoMdAdd } from "react-icons/io";

const getItems: (defaultClasses: string) => CollapseProps["items"] = (
  defaultClasses
) => [
  {
    key: "1",
    label: (
      <>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <FaLayerGroup className="text-red-500 text-xl mr-2" />
            <span className="font-semibold">GRUPO EMPRESARIAL</span>
          </div>
          <Button type="primary">Empezar Diagnostico</Button>
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
              <Button
                type="primary"
                icon={<IoMdAdd />}
                className="rounded-full"
              ></Button>
            </Popover>
          </div>
          <CompanyCards />
        </div>
      </>
    ),
    className: `rounded-2xl my-2 ${defaultClasses}`,
  },
];

export default function DataDisplay() {
  return (
    <>
      <Collapse
        size="small"
        bordered={true}
        defaultActiveKey={["1"]}
        expandIcon={({ isActive }) => (
          <SlArrowDown
            className={`text-center items-center ${
              isActive ? "rotate-180" : "rotate-0"
            }`}
          />
        )}
        items={getItems("hover:bg-slate-50 transition-all")}
        className="md:mx-8 custom_collapsed mb-8"
        collapsible="icon"
      />

      <Pagination
        align="center"
        total={85}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
        defaultPageSize={20}
        defaultCurrent={1}
      />
    </>
  );
}
