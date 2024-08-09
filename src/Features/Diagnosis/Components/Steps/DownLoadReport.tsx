import { Button, Popover } from "antd";
import React from "react";
import { IoIosCloudDownload } from "react-icons/io";
import ReportTable from "../Report/ReportTable";
import TotalTable from "../Report/TotalTable";
import ReportDiagnosis from "../Report/ReportDiagnosis";
import {
  decryptId,
  downloadBase64FileToDocx,
  downloadBase64Pdf,
} from "@/utils/utilsMethods";
import { FaFileWord, FaRegFilePdf } from "react-icons/fa";
import { diagnosisService } from "@/stores/services/diagnosisServices";
import { useSearchParams } from "react-router-dom";

interface DownLoadReportProps {
  companyId: number;
}

export const DownloadContent = ({
  companyId,
  diagnosisId,
}: {
  companyId: number;
  diagnosisId: number;
}) => {
  const [generateReport, { isLoading }] =
    diagnosisService.useGenerateReportMutation();
  return (
    <>
      <div className="flex items-center justify-center gap-4">
        <Button
          loading={isLoading}
          onClick={async () => {
            const generateFile = await generateReport({
              companyId,
              format_to_save: "word",
              diagnosisId: diagnosisId ?? 0,
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
              diagnosisId: diagnosisId ?? 0,
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
};

export default function DownLoadReport({ companyId }: DownLoadReportProps) {
  const [searchParams] = useSearchParams();
  const diagnosisParam = searchParams.get("diagnosis");
  const diagnosisId = diagnosisParam
    ? parseInt(decryptId(diagnosisParam))
    : undefined;
  return (
    <>
      <div className="flex items-center justify-between mx-4 mb-4">
        <Button>Atras</Button>
        <Popover
          content={
            <DownloadContent
              companyId={companyId}
              diagnosisId={diagnosisId ?? 0}
            />
          }
          trigger="click"
          placement="bottom"
        >
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
  );
}
