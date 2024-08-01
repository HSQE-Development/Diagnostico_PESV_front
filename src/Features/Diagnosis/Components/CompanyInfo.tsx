import HeaderTitle from "@/Components/HeaderTitle";
import InfoConsultors from "@/Features/Companies/Components/InfoProfile";
import { Company } from "@/interfaces/Company";
import {
  setNextDiagnosisCurrent,
  setPrevDiagnosisCurrent,
} from "@/stores/features/utilsSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { companyService } from "@/stores/services/companyService";
import { diagnosisService } from "@/stores/services/diagnosisServices";
import { formatNIT } from "@/utils/utilsMethods";
import { skipToken } from "@reduxjs/toolkit/query";
import { Badge, Button, message, Popconfirm, Popover, Statistic } from "antd";
import React, { useEffect, useState } from "react";
import { AiOutlineNumber } from "react-icons/ai";
import { FaCar, FaPeopleCarry, FaVoicemail } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { GiSevenPointedStar } from "react-icons/gi";
import { IoBusiness } from "react-icons/io5";
import { MdEmojiPeople, MdOutlineAlternateEmail } from "react-icons/md";

interface Props {
  companyId: number;
  onlyInfo?: boolean;
}
export default function CompanyInfo({ companyId, onlyInfo }: Props) {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.util.diagnosisCurrent);
  const stepsLenght = useAppSelector((state) => state.util.stepLenght);

  const { data, refetch } = companyService.useFindByIdQuery(
    companyId ? { id: companyId } : skipToken
  );
  const [company, setCompany] = useState<Company | null>(null);
  const [saveAnswerCuestions, { isLoading }] =
    diagnosisService.useSaveAnswerCuestionsMutation();

  const [saveDiagnosis] = diagnosisService.useSaveDiagnosisMutation();

  useEffect(() => {
    if (data) setCompany(data);
  }, [data]);

  const totalVehicles = useAppSelector(
    (state) => state.vehicleQuestion.totalQuantity
  );
  const totalDrivers = useAppSelector(
    (state) => state.driverQuestion.totalQuantity
  );

  const vehicleData = useAppSelector(
    (state) => state.vehicleQuestion.fleetData
  );
  const driverData = useAppSelector((state) => state.driverQuestion.driverData);
  const diagnosisData = useAppSelector(
    (state) => state.diagnosis.diagnosisData
  );
  const diagnosisRequirementData = useAppSelector(
    (state) => state.diagnosis.diagnosisRequirementData
  );

  const totalGeneral = totalDrivers + totalVehicles;

  const confirm = async () => {
    try {
      // Intentar eliminar la compañía
      switch (current) {
        case 0:
          if (!(data?.diagnosis_step !== current)) {
            await saveAnswerCuestions({
              company: companyId,
              vehicleData,
              driverData,
            }).unwrap();
            refetch();
            message.success("Conteo Actualizado correctamente");
          }
          dispatch(setNextDiagnosisCurrent());
          break;
        case 1:
          await saveDiagnosis({
            company: companyId,
            diagnosisDto: diagnosisData,
            diagnosisRequirementDto: diagnosisRequirementData,
          }).unwrap();
          refetch();
          // dispatch(setNextDiagnosisCurrent());
          message.success("Conteo Actualizado correctamente");
          break;
      }
    } catch (error: any) {
      // Mostrar mensaje de error
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-6 gap-2 sticky top-20  w-[30%] ml-8">
      <div className="col-span-6 ">
        <HeaderTitle
          icon={<IoBusiness />}
          title="Flota Vehicular"
          subTitle="Diagnostico sobre la flota vehicular de la empresa"
          isGrid
        />
      </div>
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
            <span className="text-sm p-2">{formatNIT(company?.nit ?? "")}</span>
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
                {company?.mission_detail.name}
              </span>
            </div>
          </div>

          <div className=" col-span-2 flex items-center  ">
            <FaPeopleCarry className="font-bold text-xl" />
            <div className="flex flex-col justify-start items-start">
              <small className="font-bold">Tamaño (Nivel del pesv)</small>
              <Popover
                placement="topLeft"
                title={
                  company?.misionality_size_criteria?.map(
                    (cri) => cri.criteria_detail?.name
                  ) ?? <Badge status="default" count="Por definirse" />
                }
              >
                <span className="text-sm  p-2 ">
                  {/* <small className="font-bold">Tamaño: </small> */}
                  {company?.size_detail?.name ?? (
                    <Badge status="default" count="Por definirse" />
                  )}
                </span>
              </Popover>
            </div>
          </div>
          <div className="col-span-1 flex items-center w-full justify-between">
            <FaPeopleGroup />
            <span className="text-sm p-2">{company?.dependant}</span> -
            <FaVoicemail className="ml-1" />
            <span className="text-sm p-2">{company?.dependant_phone}</span>
          </div>
        </div>
      </div>
      <div className="col-span-6 flex items-center justify-center gap-8">
        <div className="p-2 bg-gray-100 px-8 rounded-xl w-2/4">
          <Statistic
            title="Total Vehìculos"
            value={totalVehicles}
            valueStyle={{ color: "#3f8600" }}
            prefix={<FaCar />}
            className="w-full"
          />
        </div>
        <div className="p-2 bg-gray-100 px-8 rounded-xl w-2/4">
          <Statistic
            title="Total Conductores"
            value={totalDrivers}
            valueStyle={{ color: "#3f8600" }}
            prefix={<MdEmojiPeople />}
            className="w-full"
          />
        </div>
      </div>
      {!onlyInfo && (
        <>
          {current < stepsLenght - 1 && (
            <Popconfirm
              title="Empezar el diagnostico"
              description="Confirma todos los datos"
              onConfirm={async () => await confirm()}
              onCancel={() => null}
              okText="Continuar"
              cancelText="Cancelar"
            >
              {/* <Button danger icon={<MdDeleteOutline />} /> */}
              <Button
                type="primary"
                className="col-span-6"
                disabled={totalGeneral == 0}
                loading={isLoading}
              >
                Continuar
              </Button>
            </Popconfirm>
          )}
          {current > 0 && (
            <Button
              type="primary"
              className="col-span-6"
              loading={isLoading}
              onClick={() => {
                dispatch(setPrevDiagnosisCurrent());
              }}
            >
              Anterior
            </Button>
          )}
        </>
      )}

      {/* <div style={{ marginTop: 24 }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div> */}
    </div>
  );
}
