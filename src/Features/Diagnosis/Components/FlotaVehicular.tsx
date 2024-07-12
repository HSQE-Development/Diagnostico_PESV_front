import React from "react";
import Conductores from "./Desplegables/Conductores";
import Vehiculos from "./Desplegables/Vehiculos";

export default function FlotaVehicular({ companyId }: { companyId: number }) {
  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-col">
        {/**El desplegablae de Cantidad de vehiculos */}
        <Vehiculos companyId={companyId} />
        {/**El desplegablae de Cantidad de trabajadores y conductires */}
        <Conductores companyId={companyId} />{" "}
      </div>
    </div>
  );
}
