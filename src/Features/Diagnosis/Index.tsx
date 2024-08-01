import {
  decryptId,
  downloadBase64FileToDocx,
  downloadBase64Pdf,
} from "@/utils/utilsMethods";
import { Breadcrumb, Button, Popover, Steps } from "antd";
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
import { FaClipboardCheck, FaFileWord, FaRegFilePdf } from "react-icons/fa";
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
import ReportTable from "./Components/Report/ReportTable";
import TotalTable from "./Components/Report/TotalTable";
import { IoIosCloudDownload } from "react-icons/io";

export default function DiagnosisPage() {
  const dispatch = useAppDispatch();
  const { idCompany } = useParams();
  const companyId = parseInt(decryptId(idCompany ?? ""));
  const current = useAppSelector((state) => state.util.diagnosisCurrent);
  const { data: companyById } = companyService.useFindByIdQuery(
    companyId ? { id: companyId } : skipToken
  );
  const { data: driverByCompanyid, isLoading: isLoadingDriverByCompany } =
    diagnosisService.useFindDriversByCompanyIdQuery({ companyId });

  const { data: fleetByCompany, isLoading: isLoadingFleetByCompany } =
    diagnosisService.useFindFleetsByCompanyIdQuery({ companyId });

  useEffect(() => {
    if (companyById) {
      dispatch(setDiagnosisCurrent(companyById.diagnosis_step));
    }
  }, [companyById, dispatch]);

  useEffect(() => {
    if (fleetByCompany && !isLoadingFleetByCompany) {
      const fleetData: FleetDTO[] = fleetByCompany.map((item) => ({
        diagnosis: item.diagnosis_detail.id,
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
        diagnosis: item.diagnosis_detail.id,
        driver_question: item.driver_question_detail.id,
        quantity: item.quantity,
      }));
      dispatch(setDriverData(driverData));
    }
  }, [driverByCompanyid, isLoadingDriverByCompany, dispatch]);

  const [generateReport, { isLoading }] =
    diagnosisService.useGenerateReportMutation();

  const content = (
    <>
      <div className="flex items-center justify-center gap-4">
        <Button
          loading={isLoading}
          onClick={async () => {
            const generateFile = await generateReport({
              companyId,
              format_to_save: "word",
            }).unwrap();

            downloadBase64FileToDocx(
              generateFile.file,
              `Diagnostico_PESV_${new Date()}.docx`
            );
          }}
          icon={<FaFileWord />}
          type="primary"
          htmlType="button"
        >
          Word
        </Button>
        <Button
          loading={isLoading}
          icon={<FaRegFilePdf />}
          className="bg-red-500 text-white border-red-500 active:bg-red-700 hover:bg-red-400"
          htmlType="button"
          onClick={async () => {
            const generateFile = await generateReport({
              companyId,
              format_to_save: "pdf",
            }).unwrap();

            downloadBase64Pdf(
              generateFile.file,
              `Diagnostico_PESV_${new Date()}.pdf`
            );
          }}
        >
          PDF
        </Button>
      </div>
    </>
  );
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
          <div className="flex items-center justify-between mx-4 mb-4">
            <Button>Atras</Button>
            <Popover content={content} trigger="click" placement="bottom">
              <Button
                className="bg-orange-400 text-white border-orange-400 active:bg-orange-700 hover:bg-orange-300"
                icon={<IoIosCloudDownload />}
              >
                Descargar Informe
              </Button>
            </Popover>
          </div>
          <div className="flex flex-1 justify-between items-start gap-4">
            <div className="w-2/4">
              <ReportTable companyid={companyId} />
            </div>
            <div className="flex w-2/4 h-full flex-col items-center sticky top-20 gap-2">
              <TotalTable companyId={companyId} />
              <ReportDiagnosis companyId={companyId} />
            </div>
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
