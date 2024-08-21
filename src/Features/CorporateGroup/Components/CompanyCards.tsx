import { Company } from "@/interfaces/Company";
import { formatNIT } from "@/utils/utilsMethods";
import { Avatar, Card } from "antd";
import React from "react";
import { IoMdRemove } from "react-icons/io";
import { IoBusiness } from "react-icons/io5";

interface CompanyCardsProps {
  companiesGroup: Company;
}
export default function CompanyCards({ companiesGroup }: CompanyCardsProps) {
  return (
    <Card
      key={companiesGroup.id}
      loading={false}
      style={{ minWidth: 300 }}
      hoverable
      className="col-span-12 md:col-span-6 lg:col-span-4 border-l-4 border-green-200"
    >
      <Card.Meta
        avatar={
          <Avatar className="text-white bg-black" icon={<IoBusiness />} />
        }
        title={
          <div className="w-full flex items-center justify-between">
            <span>{companiesGroup.name}</span>
            <IoMdRemove
              className={
                "text-red-500 text-2xl bg-red-100 rounded-full hover:bg-red-200 active:bg-red-400 transition-all"
              }
            />
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
