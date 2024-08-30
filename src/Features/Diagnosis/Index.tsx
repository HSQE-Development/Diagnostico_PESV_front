import { decryptId } from "@/utils/utilsMethods";
import { Breadcrumb, Steps } from "antd";
import React, { useEffect, useMemo } from "react";
import { IoBusiness } from "react-icons/io5";
import {
  MdAccountTree,
  MdOutlineCloudDownload,
  MdOutlineDocumentScanner,
} from "react-icons/md";
import { useParams, useSearchParams } from "react-router-dom";
import QuantityForm from "./Components/Steps/QuantityForm";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import DiagnosisForm from "./Components/Steps/DiagnosisForm";
import { FaClipboardCheck } from "react-icons/fa";
import {
  setDiagnosisCurrent,
  setStepsLenght,
} from "@/stores/features/utilsSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { companyService } from "@/stores/services/companyService";
import { setFleetData } from "@/stores/features/vehicleQuestionsSlice";
import { setDriverData } from "@/stores/features/driverQuestionSlice";
import { DriverDTO, FleetDTO } from "@/interfaces/Company";
import { diagnosisService } from "@/stores/services/diagnosisServices";
import DownLoadReport from "./Components/Steps/DownLoadReport";
import { useCorporate } from "@/context/CorporateGroupContext";
import { setDiagnosis } from "@/stores/features/diagnosisSlice";

export default function DiagnosisPage() {
  const dispatch = useAppDispatch();
  const { corporateId, setCorporateId } = useCorporate();
  const { idCompany } = useParams();
  const [searchParams] = useSearchParams();
  const diagnosisParam = searchParams.get("diagnosis");
  const diagnosisId = diagnosisParam
    ? parseInt(decryptId(diagnosisParam))
    : undefined;
  const corporateParam = searchParams.get("corporate");
  const corporateParamParsed = corporateParam
    ? parseInt(decryptId(corporateParam))
    : undefined;
  const companyId = parseInt(decryptId(idCompany ?? ""));
  setCorporateId(corporateParamParsed);

  const { data: companyById } = companyService.useFindByIdQuery(
    companyId ? { id: companyId } : skipToken
  );
  const { data: driverByCompanyid, isLoading: isLoadingDriverByCompany } =
    diagnosisService.useFindDriversByCompanyIdQuery({
      companyId,
      diagnosisId: diagnosisId ?? 0,
    });

  const { data: fleetByCompany, isLoading: isLoadingFleetByCompany } =
    diagnosisService.useFindFleetsByCompanyIdQuery({
      companyId,
      diagnosisId: diagnosisId ?? 0,
    });

  const { data: diagnosisData } = diagnosisService.useFindByIdQuery(
    diagnosisId ? { diagnosisId } : skipToken
  );

  useEffect(() => {
    if (diagnosisData) {
      dispatch(setDiagnosis(diagnosisData));
    }
  }, [diagnosisData]);

  const diagnosisDataStore = useAppSelector(
    (state) => state.diagnosis.diagnosis
  );

  useEffect(() => {
    if (corporateId) {
      dispatch(setDiagnosisCurrent(diagnosisDataStore?.diagnosis_step ?? 0));
    } else {
      if (companyById) {
        dispatch(setDiagnosisCurrent(diagnosisDataStore?.diagnosis_step ?? 0));
      }
    }
  }, [companyById, dispatch, diagnosisDataStore?.diagnosis_step]);

  useEffect(() => {
    if (
      fleetByCompany &&
      !isLoadingFleetByCompany &&
      diagnosisId != undefined
    ) {
      const fleetData: FleetDTO[] = fleetByCompany.map((item) => ({
        diagnosis_counter: item.diagnosis_counter_detail.id,
        quantity_arrended: item.quantity_arrended,
        quantity_leasing: item.quantity_leasing,
        quantity_contractors: item.quantity_contractors,
        quantity_intermediation: item.quantity_intermediation,
        quantity_owned: item.quantity_owned,
        quantity_renting: item.quantity_renting,
        quantity_third_party: item.quantity_third_party,
        vehicle_question: item.vehicle_question_detail.id,
        quantity_employees: item.quantity_employees,
      }));
      dispatch(setFleetData(fleetData));
    }
  }, [fleetByCompany, isLoadingFleetByCompany, dispatch, diagnosisId]);

  useEffect(() => {
    if (
      driverByCompanyid &&
      !isLoadingDriverByCompany &&
      diagnosisId != undefined
    ) {
      const driverData: DriverDTO[] = driverByCompanyid.map((item) => ({
        diagnosis_counter: item.diagnosis_counter_detail.id,
        driver_question: item.driver_question_detail.id,
        quantity: item.quantity,
      }));
      dispatch(setDriverData(driverData));
    }
  }, [driverByCompanyid, isLoadingDriverByCompany, dispatch, diagnosisId]);

  const current = useAppSelector((state) => state.util.diagnosisCurrent);
  const steps = useMemo(() => {
    // Crear un array de pasos condicionalmente
    const stepsArray = [];

    // Añadir los otros pasos
    stepsArray.push(
      {
        title: "Conteo",
        content: <QuantityForm companyId={companyId} />,
        icon:
          corporateId || current > 0 ? null : (
            <MdAccountTree className="text-black" />
          ),
        subTitle: "Aqui se define el nivel de complejidad",
        status: corporateId || current > 0 ? "finish" : "process",
      },
      {
        title: "Lista de Verificación",
        content: <DiagnosisForm companyId={companyId} />,
        icon: current > 1 ? null : <FaClipboardCheck />,
        status: current > 1 ? "finish" : "process",
      },
      {
        title: "Informe",
        icon: <MdOutlineCloudDownload />,
        content: (
          <DownLoadReport
            companyId={companyId}
            secuence={diagnosisData?.sequence ?? ""}
            schedule={diagnosisData?.schedule ?? ""}
          />
        ),
        subTitle: "Generar el informe del diagnostico",
      }
    );

    return stepsArray;
  }, [companyId, diagnosisData, corporateId]);

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

  const validCurrent = current >= 0 && current < steps.length;
  dispatch(setStepsLenght(steps.length));
  const contentToRender = validCurrent ? steps[current].content : null;

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
              href: "/app/companies", //Ruta donde redirije
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
        {contentToRender}
      </div>
    </div>
  );
}
