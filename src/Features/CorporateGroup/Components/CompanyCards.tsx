import { Company } from "@/interfaces/Company";
import { formatNIT } from "@/utils/utilsMethods";
import { Avatar, Card, Popconfirm, Tooltip } from "antd";
import React from "react";
import { IoMdRemove } from "react-icons/io";
import { IoBusiness } from "react-icons/io5";
import { VscRunAll } from "react-icons/vsc";

interface CompanyCardsProps {
  companiesGroup: Company;
  isLoading?: boolean;
  showDeleteButtom?: boolean;
  onClick?: () => void;
  onDeleteClick?: () => void;
  setCompanyId?: (id: number) => void;
}
export default function CompanyCards({
  companiesGroup,
  isLoading = false,
  showDeleteButtom = true,
  onClick,
  onDeleteClick,
  setCompanyId,
}: CompanyCardsProps) {
  return (
    <Card
      key={companiesGroup.id}
      loading={isLoading}
      style={{ minWidth: 300 }}
      hoverable
      className="col-span-12 md:col-span-6 lg:col-span-4 border-l-4 border-green-200 cursor-auto"
      onClick={!showDeleteButtom ? onClick : () => null}
    >
      <Card.Meta
        avatar={
          <Avatar className="text-white bg-black" icon={<IoBusiness />} />
        }
        title={
          <div className="w-full flex items-center justify-between">
            <span>{companiesGroup.name}</span>
            <div className="flex flex-col items-center justify-evenly gap-4 h-full">
              {showDeleteButtom && (
                <Popconfirm
                  title="Quitar Empresa del grupo"
                  description="¿Estas seguro de quitar Empresa del grupo?"
                  onConfirm={onDeleteClick}
                  onCancel={() => false}
                  okText="Quitar"
                  cancelText="No"
                >
                  <Tooltip placement="top" title={"Quitar Empresa del grupo"}>
                    <IoMdRemove
                      className={
                        "text-red-500 text-2xl bg-red-100 rounded-full hover:bg-red-200 active:bg-red-400 transition-all cursor-pointer"
                      }
                    />
                  </Tooltip>
                </Popconfirm>
              )}
            </div>
          </div>
        }
        description={
          <>
            <div className="flex items-center justify-between">
              <div>
                <p>{formatNIT(companiesGroup.nit)}</p>
                <p>{companiesGroup.arl_detail.name}</p>
              </div>
              {showDeleteButtom && (
                <Tooltip placement="bottom" title={"Hacer conteo"}>
                  <VscRunAll
                    className={
                      "text-blue-500 text-xl rounded-full hover:bg-blue-200 active:bg-blue-400 transition-all cursor-pointer"
                    }
                    onClick={() => {
                      onClick?.();
                      setCompanyId?.(companiesGroup.id);
                    }}
                  />
                </Tooltip>
              )}
            </div>
          </>
        }
      />
    </Card>
  );
}
