import { decryptId } from "@/utils/utilsMethods";
import { Skeleton, Steps } from "antd";
import React, { lazy, Suspense, useMemo } from "react";
import { FaWpforms } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { CiCircleCheck, CiSearch } from "react-icons/ci";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import SuccesMessage from "./SuccesMessage";
const QuantityForm = lazy(
  () => import("@/Features/Diagnosis/Components/Steps/QuantityForm")
);
const SearchCompanyByNitForm = lazy(() => import("./SearchCompanyByNitForm"));

export default function MainSteper() {
  const [searchParams] = useSearchParams();
  const companyParam = searchParams.get("company");
  const companyId = companyParam
    ? parseInt(decryptId(companyParam))
    : undefined;
  const dispatch = useAppDispatch();
  const externalCurrent = useAppSelector((state) => state.util.externalCurrent);
  //(externalCurrent);
  const steps = useMemo(() => {
    // Crear un array de pasos condicionalmente
    const stepsArray = [];

    // Añadir los otros pasos
    stepsArray.push(
      {
        title: "Busqueda",
        content: (
          <Suspense fallback={<Skeleton active />}>
            <SearchCompanyByNitForm />
          </Suspense>
        ),
        icon: externalCurrent > 0 ? null : <CiSearch />,
        subTitle: "Busca tu empresa por NIT",
        status: externalCurrent > 0 ? "finish" : "process", // Asigna un estado adecuado
      },
      {
        title: "Caracterizacón",
        content: (
          <Suspense fallback={<Skeleton active />}>
            <QuantityForm companyId={companyId ?? 0} isOver isExternal />
          </Suspense>
        ),
        icon: externalCurrent > 1 ? null : <FaWpforms />,
        subTitle: "Cuantos vehiculos y cuantos conductores tienes?",
        status: externalCurrent > 1 ? "finish" : "process", // Asigna un estado adecuado
      },
      {
        status: "finish",
        icon: <CiCircleCheck />,
        title: "Fin",
        content: (
          <>
            <SuccesMessage />
          </>
        ),
        subTitle: "La informaciòn sera validada por un acesor",
      }
    );

    return stepsArray;
  }, [externalCurrent, dispatch]);

  const items = useMemo(
    () =>
      steps.map((item) => ({
        key: item.title,
        title: item.title,
        icon: item.icon,
        subTitle: item.subTitle,
      })),
    [steps]
  );
  const validCurrent = externalCurrent >= 0 && externalCurrent < steps.length;
  const contentToRender = validCurrent ? steps[externalCurrent].content : null;
  return (
    <>
      <div className="mx-4 mt-4 bg-zinc-100 py-4 px-2 rounded-2xl ">
        <Steps size="small" current={externalCurrent} items={items} />
        <div className="mt-4 border-2 border-dashed rounded-xl px-2 py-4 bg-white ">
          {contentToRender}
        </div>
      </div>
    </>
  );
}
