import HeaderTitle from "@/Components/HeaderTitle";
import { companyService } from "@/stores/services/companyService";
import { decryptId } from "@/utils/utilsMethods";
import { skipToken } from "@reduxjs/toolkit/query";
import { Breadcrumb } from "antd";
import React from "react";
import { IoBusiness } from "react-icons/io5";
import { MdUpdate } from "react-icons/md";
import { useParams, useSearchParams } from "react-router-dom";
import HistoryTimeLine from "./Components/HistoryTimeLine";

export default function DiagnosisTimeLinePage() {
  const { idCompany } = useParams();
  const companyId = parseInt(decryptId(idCompany ?? ""));

  const [searchParams] = useSearchParams();
  const diagnosisParam = searchParams.get("diagnosis");
  const diagnosisId = diagnosisParam
    ? parseInt(decryptId(diagnosisParam))
    : undefined;

  const { data: companyById } = companyService.useFindByIdQuery(
    companyId ? { id: companyId } : skipToken
  );
  return (
    <>
      <div className="flex flex-col">
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
                href: "/app/companies", //Ruta donde redirije
                className: "flex items-center justify-around gap-2 p-1",
              },
              {
                title: (
                  <>
                    <MdUpdate />
                    <span>Historico</span>
                  </>
                ),
                className: "flex items-center justify-around gap-2",
              },
            ]}
          />
        </div>
        <div className="w-full flex flex-col md:flex-row items-center justify-between md:p-8">
          <HeaderTitle
            icon={<MdUpdate />}
            title={`Diagnosticos realizados a ${companyById?.name}`}
            subTitle="Todos los diagnosticos que se le realizaron a esta empresa, puedes dar click para editarlos o ver su información"
          />
        </div>
        <div className="flex w-full items-center justify-center">
          <HistoryTimeLine diagnosis={companyById?.company_diagnosis ?? []} />
        </div>
      </div>
    </>
  );
}
