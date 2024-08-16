import { Diagnosis } from "@/interfaces/Company";
import { encryptId } from "@/utils/utilsMethods";
import { Badge } from "antd";
import React, { useState } from "react";
import { CgEditBlackPoint } from "react-icons/cg";
import { CiCalendarDate } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import InfoConsultors from "./InfoProfile";

interface CompanydiagnosisProps {
  diagnosis: Diagnosis[];
  companyid: number;
}

export const DiagnosisItemList = ({ diagnosis }: { diagnosis: Diagnosis }) => {
  const navigate = useNavigate();
  return (
    <>
      <button
        type="button"
        className="w-full p-2 border rounded-lg flex flex-col justify-evenly items-start gap-2 cursor-pointer hover:bg-gradient-to-br from-zinc-50 via-slate-100 to-zinc-100 active:bg-slate-100 transition-all my-2"
        onClick={() =>
          navigate(
            `/app/companies/diagnosis/${encryptId(
              diagnosis.company.toString()
            )}?diagnosis=${encryptId(diagnosis.id.toString())}`
          )
        }
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-gray-500">
            <CiCalendarDate />
            <span>Fecha</span>
          </div>
          {diagnosis.date_elabored.toString()}
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-gray-500">
            <CiCalendarDate />
            <span>Nivel PESV</span>
          </div>
          <span className="font-bold ml-2">
            {diagnosis.type_detail.name.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-gray-500">
            <CgEditBlackPoint />
            <span>Estado</span>
          </div>
          {diagnosis.is_finalized ? (
            <Badge color="#86EFAC" count={"Completado"} />
          ) : (
            <Badge count={"En Progreso"} />
          )}
        </div>
        <div className="flex items-center justify-between w-full">
          <InfoConsultors consultand={diagnosis.consultor_detail} />
        </div>
      </button>
    </>
  );
};

export default function CompanyDiagnosis({
  diagnosis,
  companyid,
}: CompanydiagnosisProps) {
  const [showAll] = useState(false);
  // Sort the diagnosis array by is_finalized, with finalized items appearing last
  const sortedDiagnosis = [...diagnosis].sort((a, b) => {
    return a.is_finalized === b.is_finalized ? 0 : a.is_finalized ? 1 : -1;
  });
  const displayedDiagnosis = showAll
    ? sortedDiagnosis
    : sortedDiagnosis.slice(0, 2); // Muestra cuantos items se muestran

  const router = useNavigate();
  return (
    <>
      {displayedDiagnosis.map((diagnostic) => (
        <DiagnosisItemList key={diagnostic.id} diagnosis={diagnostic} />
      ))}
      {diagnosis.length > 2 && !showAll && (
        <button
          onClick={() =>
            router(
              `/app/companies/diagnosis/history/${encryptId(
                companyid.toString()
              )}`
            )
          }
          className="w-full p-2 border rounded-lg flex justify-center items-center gap-2 cursor-pointer hover:bg-gradient-to-br from-zinc-50 via-slate-100 to-zinc-100 active:bg-slate-100 transition-all my-2"
        >
          Ver más
        </button>
      )}
    </>
  );
}
