import { companyService } from "@/stores/services/companyService";
import { decryptId, formatNIT } from "@/utils/utilsMethods";
import { skipToken } from "@reduxjs/toolkit/query";
import { Breadcrumb, Button, Popover } from "antd";
import React, { useEffect, useState } from "react";
import { IoBusiness } from "react-icons/io5";
import {
  MdOutlineAlternateEmail,
  MdOutlineDocumentScanner,
} from "react-icons/md";
import { useParams } from "react-router-dom";
import InfoConsultors from "../Companies/Components/InfoProfile";
import { Company } from "@/interfaces/Company";
import { FaPeopleCarry, FaVoicemail } from "react-icons/fa";
import { GiSevenPointedStar } from "react-icons/gi";
import { FaPeopleGroup } from "react-icons/fa6";
import FlotaVehicular from "./Components/FlotaVehicular";
import { AiOutlineNumber } from "react-icons/ai";

export default function DiagnosisPage() {
  const { idCompany } = useParams();
  const companyId = parseInt(decryptId(idCompany ?? ""));
  const { data } = companyService.useFindByIdQuery(
    companyId ? { id: companyId } : skipToken
  );
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    if (data) setCompany(data);
  }, [data]);
  return (
    <div className="w-full flex flex-col">
      <div className="p-4 flex items-center">
        <Breadcrumb
          className="flex items-center"
          separator="/"
          items={[
            {
              title: (
                <>
                  <IoBusiness />
                  <span>Empresas</span>
                </>
              ),
              href: "/app/companies",
              className: "flex items-center justify-around gap-2 p-1",
            },
            {
              title: (
                <>
                  <MdOutlineDocumentScanner />
                  <span>Diagnostico</span>
                </>
              ),
              className: "flex items-center justify-around gap-2",
            },
          ]}
        />
      </div>
      <div className="flex flex-1 justify-between items-start gap-4">
        <div className="grid grid-cols-6 gap-2 sticky top-20  w-[30%] ml-8">
          <div className="w-full bg-gradient-to-r from-zinc-100 to-sky-50 rounded-xl p-4 col-span-6 flex flex-col items-start justify-start">
            <div className="flex items-center justify-around w-full my-2">
              <div className="flex items-center justify-start gap-2">
                <IoBusiness />
                {data?.name}
              </div>
              <InfoConsultors
                consultand={company ? company.consultor_detail : null}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 border-l-4 border-black pl-4">
              <div className=" col-span-2  flex items-center">
                <AiOutlineNumber className="font-bold text-xl" />
                <span className="text-sm p-2">
                  {formatNIT(company?.nit ?? "")}
                </span>
              </div>
              <div className=" col-span-2  flex items-center">
                <MdOutlineAlternateEmail className="font-bold text-xl" />
                <span className="text-sm p-2">{company?.email}</span>
              </div>
              <div className="col-span-2  flex items-center">
                <GiSevenPointedStar className="font-bold text-xl" />
                <div className="flex flex-col justify-start items-start">
                  <small className="font-bold">Misionalidad</small>
                  <span className="text-sm p-2">
                    {company?.dedication_detail.name}
                  </span>
                </div>
              </div>

              <div className=" col-span-2 flex items-center  ">
                <FaPeopleCarry className="font-bold text-xl" />
                <div className="flex flex-col justify-start items-start">
                  <small className="font-bold">Tamaño</small>
                  <Popover
                    placement="topLeft"
                    title={company?.company_size_detail.description}
                  >
                    <span className="text-sm  p-2 ">
                      {/* <small className="font-bold">Tamaño: </small> */}
                      {company?.company_size_detail.name}
                    </span>
                  </Popover>
                </div>
              </div>
              <div className="col-span-1 flex items-center">
                <FaPeopleGroup />
                <span className="text-sm p-2">{company?.dependant}</span> -
                <FaVoicemail className="ml-1" />
                <span className="text-sm p-2">{company?.dependant_phone}</span>
              </div>
            </div>
          </div>
          <Button type="primary" className="col-span-6" disabled>
            Continuar
          </Button>
        </div>
        <div className="flex flex-col flex-1">
          <FlotaVehicular companyId={companyId} />
        </div>
      </div>
    </div>
  );
}
