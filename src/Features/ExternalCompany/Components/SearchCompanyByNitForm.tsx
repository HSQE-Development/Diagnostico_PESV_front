import FloatLabel from "@/Components/FloatLabel";
import { companyService } from "@/stores/services/companyService";
import { Button, Empty, Input, Skeleton } from "antd";
import React, { lazy, Suspense, useState } from "react";
import { CiSearch } from "react-icons/ci";
const CompanyCard = lazy(() => import("./CompanyCard"));

export default function SearchCompanyByNitForm() {
  const [nit, setNit] = useState<string | null>(null);
  // Solo ejecuta la búsqueda cuando 'searchNit' tiene valor
  const [trigger, { data: companyByNit, isFetching }] =
    companyService.useLazyFindCompanyByNitQuery();

  const handleSearch = () => {
    if (nit) {
      trigger({ nit }); // Llama manualmente a la búsqueda con el nit actual
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 md:gap-0 md:flex-row justify-center items-start ">
      <div className="flex items-center justify-start gap-1 w-full md:w-[40%] mt-4">
        <FloatLabel label="Nit">
          <Input
            className="w-full"
            id="nit"
            name="nit"
            value={nit ?? ""}
            onChange={(e) => setNit(e.target.value)}
          />
        </FloatLabel>
        <Button
          className="bg-black hover:bg-slate-600 active:bg-slate-400 text-white font-bold"
          icon={<CiSearch />}
          onClick={handleSearch} // Ejecuta la búsqueda al hacer clic
          loading={isFetching} // Muestra el estado de carga mientras busca
        ></Button>
      </div>
      <div className="flex-1 w-full md:w-1/2">
        <div className="flex flex-col justify-center items-center">
          {/* Muestra los datos de la empresa si existen */}
          {companyByNit?.nit ? (
            <Suspense fallback={<Skeleton.Input active={isFetching} block />}>
              <CompanyCard company={companyByNit} />
            </Suspense>
          ) : (
            <div className="w-full flex items-center justify-center">
              <Empty description="No encontramos información :(" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
