import { Company } from "@/interfaces/Company";
import { formatNIT } from "@/utils/utilsMethods";
import { Avatar, Card, Popconfirm, Tooltip } from "antd";
import React from "react";
import { IoMdRemove } from "react-icons/io";
import { IoBusiness } from "react-icons/io5";

interface CompanyCardsProps {
  companiesGroup: Company;
  isLoading?: boolean;
  showDeleteButtom?: boolean;
  onClick?: () => void;
  onDeleteClick?: () => void;
}
export default function CompanyCards({
  companiesGroup,
  isLoading = false,
  showDeleteButtom = true,
  onClick,
  onDeleteClick,
}: CompanyCardsProps) {
  const handleCardClick = (event: React.MouseEvent) => {
    // Si el botón de eliminar está siendo mostrado, previene el clic en el Card
    if (!showDeleteButtom) {
      onClick?.();
    }
  };

  const handleIconClick = (event: React.MouseEvent) => {
    // Evita la propagación del clic al Card
    event.stopPropagation();
  };
  return (
    <Card
      key={companiesGroup.id}
      loading={isLoading}
      style={{ minWidth: 300 }}
      hoverable
      className="col-span-12 md:col-span-6 lg:col-span-4 border-l-4 border-green-200"
      onClick={handleCardClick}
    >
      <Card.Meta
        avatar={
          <Avatar className="text-white bg-black" icon={<IoBusiness />} />
        }
        title={
          <div className="w-full flex items-center justify-between">
            <span>{companiesGroup.name}</span>
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
                      "text-red-500 text-2xl bg-red-100 rounded-full hover:bg-red-200 active:bg-red-400 transition-all"
                    }
                    onClick={handleIconClick}
                  />
                </Tooltip>
              </Popconfirm>
            )}
          </div>
        }
        description={
          <>
            <p>{formatNIT(companiesGroup.nit)}</p>
            <p>{companiesGroup.arl_detail.name}</p>
          </>
        }
      />
    </Card>
  );
}
