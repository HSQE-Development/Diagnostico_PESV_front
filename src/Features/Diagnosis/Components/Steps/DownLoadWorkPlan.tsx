import { diagnosisService } from "@/stores/services/diagnosisServices";
import {
  decryptId,
  downloadBase64FileToDocx,
  downloadBase64Pdf,
} from "@/utils/utilsMethods";
import { Button, Popover } from "antd";
import React from "react";
import { FaFileWord, FaRegFilePdf } from "react-icons/fa";
import { IoIosCloudDownload } from "react-icons/io";
import { useSearchParams } from "react-router-dom";

export const DownloadContentWorkPlan = ({
  companyId,
  diagnosisId,
}: {
  companyId: number;
  diagnosisId: number;
}) => {
  const [generateWorkPlan, { isLoading }] =
    diagnosisService.useGenerateWorkPlanMutation();

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-full flex justify-around flex-1 gap-2">
          <Button
            loading={isLoading}
            onClick={async () => {
              const generateFile = await generateWorkPlan({
                companyId,
                format_to_save: "word",
                diagnosisId: diagnosisId ?? 0,
              }).unwrap();

              downloadBase64FileToDocx(
                generateFile.file,
                `F-SER-06 Plan de Trabajo_${new Date()}.docx`
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
            className="bg-red-500 text-white border-red-500 active:bg-red-700 hover:bg-red-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300"
            htmlType="button"
            onClick={async () => {
              const generateFile = await generateWorkPlan({
                companyId,
                format_to_save: "pdf",
                diagnosisId: diagnosisId ?? 0,
              }).unwrap();

              downloadBase64Pdf(
                generateFile.file,
                `F-SER-06 Plan de Trabajo_${new Date()}.pdf`
              );
            }}
          >
            PDF
          </Button>
        </div>
      </div>
    </>
  );
};

interface DownloadWorkPlanProps {
  companyId: number;
}

export default function DownLoadWorkPlan({ companyId }: DownloadWorkPlanProps) {
  const [searchParams] = useSearchParams();
  const diagnosisParam = searchParams.get("diagnosis");
  const diagnosisId = diagnosisParam
    ? parseInt(decryptId(diagnosisParam))
    : undefined;
  return (
    <>
      <Popover
        content={
          <DownloadContentWorkPlan
            companyId={companyId}
            diagnosisId={diagnosisId ?? 0}
          />
        }
        trigger="click"
        placement="bottom"
      >
        <Button
          className="text-orange-400 border-orange-400 active:bg-orange-300 hover:bg-orange-100"
          icon={<IoIosCloudDownload />}
          type="dashed"
        >
          Descargar Plan de trabajo
        </Button>
      </Popover>
    </>
  );
}
