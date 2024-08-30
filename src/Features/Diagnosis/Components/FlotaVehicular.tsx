import React from "react";
import Conductores from "./Desplegables/Conductores";
import Vehiculos from "./Desplegables/Vehiculos";

export default function FlotaVehicular({
  companyId,
}: {
  companyId: number; //Para cuando se usa el componente por fuera osea solo para hacer el conteo del pesv, cancela la conulta previa de eixstencias
}) {
  return (
    <div className="flex flex-col overflow-auto">
      <div className="w-full flex flex-col gap-2">
        {/**El desplegablae de Cantidad de vehiculos */}
        <Vehiculos companyId={companyId} />
        {/**El desplegablae de Cantidad de trabajadores y conductires */}
        <Conductores companyId={companyId} />{" "}
      </div>
    </div>
  );
}
