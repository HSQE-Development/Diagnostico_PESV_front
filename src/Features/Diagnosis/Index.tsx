import { decryptId, downloadBase64File } from "@/utils/utilsMethods";
import { Breadcrumb, Button, Steps } from "antd";
import React, { useEffect } from "react";
import { IoBusiness } from "react-icons/io5";
import {
  MdAccountTree,
  MdOutlineCloudDownload,
  MdOutlineDocumentScanner,
} from "react-icons/md";
import { useParams } from "react-router-dom";
import QuantityForm from "./Components/Steps/QuantityForm";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import DiagnosisForm from "./Components/Steps/DiagnosisForm";
import { FaClipboardCheck, FaFileWord } from "react-icons/fa";
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
import ReportDiagnosis from "./Components/Report/ReportDiagnosis";

export default function DiagnosisPage() {
  const dispatch = useAppDispatch();
  const { idCompany } = useParams();
  const companyId = parseInt(decryptId(idCompany ?? ""));
  const current = useAppSelector((state) => state.util.diagnosisCurrent);
  const { data: companyById } = companyService.useFindByIdQuery(
    companyId ? { id: companyId } : skipToken
  );
  const { data: driverByCompanyid, isLoading: isLoadingDriverByCompany } =
    companyService.useFindDriversByCompanyIdQuery({ companyId });

  const { data: fleetByCompany, isLoading: isLoadingFleetByCompany } =
    companyService.useFindFleetsByCompanyIdQuery({ companyId });

  useEffect(() => {
    if (companyById) {
      dispatch(setDiagnosisCurrent(companyById.diagnosis_step));
    }
  }, [companyById, dispatch]);

  useEffect(() => {
    if (fleetByCompany && !isLoadingFleetByCompany) {
      const fleetData: FleetDTO[] = fleetByCompany.map((item) => ({
        company: item.company_detail.id,
        quantity_arrended: item.quantity_arrended,
        quantity_leasing: item.quantity_leasing,
        quantity_contractors: item.quantity_contractors,
        quantity_intermediation: item.quantity_intermediation,
        quantity_owned: item.quantity_owned,
        quantity_renting: item.quantity_renting,
        quantity_third_party: item.quantity_third_party,
        vehicle_question: item.vehicle_question_detail.id,
      }));
      dispatch(setFleetData(fleetData));
    }
  }, [fleetByCompany, isLoadingFleetByCompany, dispatch]);
  useEffect(() => {
    if (driverByCompanyid && !isLoadingDriverByCompany) {
      const driverData: DriverDTO[] = driverByCompanyid.map((item) => ({
        company: item.company_detail.id,
        driver_question: item.driver_question_detail.id,
        quantity: item.quantity,
      }));
      dispatch(setDriverData(driverData));
    }
  }, [driverByCompanyid, isLoadingDriverByCompany, dispatch]);

  const [generateReport, { isLoading }] =
    diagnosisService.useGenerateReportMutation();
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
      title: "Informe",
      icon: <MdOutlineCloudDownload />,
      content: (
        <>
          <div className="flex items-center justify-end mr-4">
            <Button
              loading={isLoading}
              onClick={async () => {
                const generateFile = await generateReport({
                  companyId,
                }).unwrap();

                downloadBase64File(
                  generateFile.file,
                  `Diagnostico_PESV_${new Date()}.docx`
                );
              }}
              icon={<FaFileWord />}
              type="primary"
              htmlType="button"
            >
              Descargar Informe
            </Button>
          </div>
          <div className="grid w-full h-full grid-cols-2">
            <ReportDiagnosis companyId={companyId} />
          </div>
        </>
      ),
      subTitle: "Generar el informe del diagnostico",
    },
  ];
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
    icon: item.icon,
    subTitle: item.subTitle,
  }));
  const validCurrent = current >= 0 && current < steps.length;
  const contentToRender = validCurrent ? steps[current].content : null;
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
