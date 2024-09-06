import React from "react";
import FlotaVehicular from "../FlotaVehicular";
import CompanyInfo from "../CompanyInfo";
import { ConfigComun } from "@/interfaces/Comun";
import { CiCircleInfo } from "react-icons/ci";

interface Props extends Partial<ConfigComun> {
  companyId: number;
  isOver?: boolean; //Para cuando se usa el componente por fuera osea solo para hacer el conteo del pesv
}
export default function QuantityForm({
  companyId,
  isOver = false,
  isExternal,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row flex-1 justify-between items-start gap-4">
      <CompanyInfo
        companyId={companyId}
        isOutOfContext={isOver}
        isExternal={isExternal}
      />
      <div className="flex flex-col flex-1 w-full md:w-2/4">
        {isExternal && (
          <div className="flex items-center mb-2">
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col">
                <span className="flex items-center gap-2">
                  <CiCircleInfo />
                  Flota Vehicular
                </span>
                <small>
                  Incluye el número de vehículos automotores y no automotores
                  puestos al servicio de la organización para el cumplimiento de
                  sus funciones en los procesos estratégicos, misionales y de
                  apoyo, ya sean vehículos propios, arrendados, en leasing,
                  renting, entre otros, o que hagan parte de cualquier modelo de
                  vinculación, contratación, intermediación o administración que
                  realice la organización con el propietario, tenedor o
                  conductor del vehículo, también incluye los vehiculos
                  utilizados por los contratistas y trabajadores de la
                  organización.
                </small>
              </div>
              <div className="flex flex-col">
                <span className="flex items-center gap-2">
                  <CiCircleInfo />
                  Conductores contratados
                </span>
                <small>
                  corresponde al número de personas que utilizan un vehículo
                  automotor y no automotor puesto al servicio de la organización
                  para el cumplimiento de sus funciones, independientemente del
                  modelo de contratación o administración (vinculación o
                  intermediación) que utilice la organización.
                </small>
              </div>
            </div>
          </div>
        )}
        <FlotaVehicular companyId={companyId} />
      </div>
    </div>
  );
}
