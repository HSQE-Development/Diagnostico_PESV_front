import { Company } from "@/interfaces/Company";
import { setNextExternalCurrent } from "@/stores/features/utilsSlice";
import { useAppDispatch } from "@/stores/hooks";
import { encryptId, formatNIT } from "@/utils/utilsMethods";
import { Button } from "antd";
import React from "react";
import { CiCircleInfo } from "react-icons/ci";
import { LuBuilding } from "react-icons/lu";
import { MdNavigateNext } from "react-icons/md";
import { TiDocumentText } from "react-icons/ti";
import { useLocation, useNavigate } from "react-router-dom";

type CompanyCardProps = {
  company: Company;
};
export default function CompanyCard({ company }: CompanyCardProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const handleNext = () => {
    navigate(
      `${location.pathname}?company=${encryptId(company.id.toString())}`,
      { replace: true }
    );
    dispatch(setNextExternalCurrent());
  };
  return (
    <div className="rounded-lg flex flex-col w-full md:w-2/3 shadow-xl overflow-hidden">
      <div className="bg-zinc-700 p-4 flex flex-col md:flex-row md:items-center gap-4 md:gap-0 justify-evenly">
        <div className="text-white flex items-center gap-2">
          <LuBuilding />
          <p>{company.name}</p>
        </div>
        <div className="text-white flex items-center gap-2">
          <TiDocumentText />
          <p>{formatNIT(company.nit)}</p>
        </div>
      </div>
      <div className="w-full bg-white flex flex-col p-4 overflow-auto gap-4">
        <div className="flex flex-col">
          <small className="text-zinc-500">Ciius</small>
          <div className="flex w-full overflow-x-auto space-x-4">
            {company.ciius_detail?.map((ciiu) => (
              <div
                className="whitespace-nowrap bg-gray-100 p-2 rounded-md"
                key={ciiu.id}
              >
                {ciiu.code} - {ciiu.name}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-around md:justify-evenly ">
          <span className="flex flex-col">
            <small className="text-zinc-500">Arl:</small>
            <p className="ml-2">{company.arl_detail.name}</p>
          </span>
          <span className="flex flex-col">
            <small className="text-zinc-500">Segmento:</small>
            <p className="ml-2">{company.segment_detail.name}</p>
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-evenly ">
          <span className="flex flex-col">
            <small className="text-zinc-500">Contacto:</small>
            <p className="ml-2">
              {company.dependant} - {company.dependant_position}
            </p>
          </span>
          <span className="flex flex-col">
            <small className="text-zinc-500">Telefono:</small>
            <p className="ml-2">{company.segment_detail.name}</p>
          </span>
          <span className="flex flex-col">
            <small className="text-zinc-500">Correo:</small>
            <p className="ml-2">{company.segment_detail.name}</p>
          </span>
        </div>
        <div className="flex items-center justify-evenly ">
          <span className="border-l-2 border-zinc-700 pl-2 flex flex-col">
            <small className="text-zinc-500">Misionalidad:</small>
            <p className="ml-2">
              {company.mission_detail.id} - {company.mission_detail.name}
            </p>
          </span>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-end gap-4">
          <small className="flex items-center gap-1 text-zinc-500">
            <CiCircleInfo />
            Si los datos son correctos, continuemos
          </small>
          <Button
            icon={<MdNavigateNext />}
            iconPosition="end"
            className="bg-black hover:bg-slate-600 active:bg-slate-400 text-white font-bold w-full md:w-auto border-black"
            onClick={handleNext}
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
