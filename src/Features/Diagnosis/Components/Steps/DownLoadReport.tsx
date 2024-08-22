import { Button, Input, Popover } from "antd";
import React, { useState } from "react";
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
import FloatLabel from "@/Components/FloatLabel";
import { MdArrowBackIosNew } from "react-icons/md";
import { useAppDispatch } from "@/stores/hooks";
import { setPrevDiagnosisCurrent } from "@/stores/features/utilsSlice";

interface DownLoadReportProps {
  companyId: number;
  secuence: string;
  schedule: string;
}

export const DownloadContent = ({
  companyId,
  diagnosisId,
  scheduleParam,
  sequenceParam,
}: {
  companyId: number;
  diagnosisId: number;
  scheduleParam: string;
  sequenceParam: string;
}) => {
  const [generateReport, { isLoading }] =
    diagnosisService.useGenerateReportMutation();

  const [schedule, setSchedule] = useState<string>(scheduleParam);
  const [sequence, setSequence] = useState<string>(sequenceParam);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 mt-4">
        <div className="flex flex-col gap-4 gap-y-5">
          <FloatLabel label="Cronograma">
            <Input
              id="name"
              name="name"
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
            />
          </FloatLabel>
          <FloatLabel label="Secuencia">
            <Input
              id="name"
              name="name"
              type="text"
              value={sequence}
              onChange={(e) => setSequence(e.target.value)}
            />
          </FloatLabel>
        </div>
        <div className="w-full flex justify-around flex-1">
          <Button
            loading={isLoading}
            onClick={async () => {
              const generateFile = await generateReport({
                companyId,
                format_to_save: "word",
                diagnosisId: diagnosisId ?? 0,
                sequence,
                schedule,
              }).unwrap();

              downloadBase64FileToDocx(
                generateFile.file,
                `Diagnostico_PESV_${new Date()}.docx`
              );
            }}
            icon={<FaFileWord />}
            type="primary"
            htmlType="button"
            disabled={sequence == "" || schedule == ""}
          >
            Word
          </Button>
          <Button
            loading={isLoading}
            icon={<FaRegFilePdf />}
            className="bg-red-500 text-white border-red-500 active:bg-red-700 hover:bg-red-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300"
            htmlType="button"
            disabled={sequence == "" || schedule == ""}
            onClick={async () => {
              const generateFile = await generateReport({
                companyId,
                format_to_save: "pdf",
                diagnosisId: diagnosisId ?? 0,
                schedule,
                sequence,
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
      </div>
    </>
  );
};

export default function DownLoadReport({
  companyId,
  schedule,
  secuence,
}: DownLoadReportProps) {
  const [searchParams] = useSearchParams();
  const diagnosisParam = searchParams.get("diagnosis");
  const diagnosisId = diagnosisParam
    ? parseInt(decryptId(diagnosisParam))
    : undefined;
  const dispatch = useAppDispatch();

  const handleBackStep = () => dispatch(setPrevDiagnosisCurrent());
  return (
    <>
      <div className="flex items-center justify-between mx-4 mb-4">
        <Button icon={<MdArrowBackIosNew />} onClick={handleBackStep}>
          Atras
        </Button>
        <Popover
          content={
            <DownloadContent
              companyId={companyId}
              scheduleParam={schedule}
              sequenceParam={secuence}
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
        <div className="flex w-2/4 h-full flex-col items-center sticky top-2 gap-2 shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] m-2 py-4 rounded-lg bg-gradient-to-br from-slate-50 to-neutral-100">
          <TotalTable companyId={companyId} />
          <ReportDiagnosis companyId={companyId} />
        </div>
      </div>
    </>
  );
}
