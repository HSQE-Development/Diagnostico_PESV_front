import { decryptId } from "@/utils/utilsMethods";
import { Breadcrumb, Steps } from "antd";
import React from "react";
import { IoBusiness } from "react-icons/io5";
import { MdAccountTree, MdOutlineDocumentScanner } from "react-icons/md";
import { useParams } from "react-router-dom";
import QuantityForm from "./Components/Steps/QuantityForm";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import DiagnosisForm from "./Components/Steps/DiagnosisForm";
import { FaClipboardCheck } from "react-icons/fa";
import { setStepsLenght } from "@/stores/features/utilsSlice";

export default function DiagnosisPage() {
  const dispatch = useAppDispatch();
  const { idCompany } = useParams();
  const companyId = parseInt(decryptId(idCompany ?? ""));
  const current = useAppSelector((state) => state.util.diagnosisCurrent);
  const steps = [
    {
      title: "Conteo",
      content: (
        <>
          <QuantityForm companyId={companyId} />
        </>
      ),
      icon: <MdAccountTree className="text-black" />,
      subTitle: "Aqui se define el nivel de complejidad",
    },
    {
      title: "Lista de Verificación",
      content: (
        <>
          <DiagnosisForm companyId={companyId} />
        </>
      ),
      icon: <FaClipboardCheck />,
    },
    {
      title: "Conteo",
      content: (
        <>
          <small>Adios</small>
        </>
      ),
    },
  ];
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
    icon: item.icon,
    subTitle: item.subTitle,
  }));

  dispatch(setStepsLenght(steps.length));

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
      <Steps size="small" current={current} items={items} type="navigation" />
      <div className="mt-4 border-2 border-dashed rounded-xl p-2">
        {steps[current].content}
      </div>
    </div>
  );
}
