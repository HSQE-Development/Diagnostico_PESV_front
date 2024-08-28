import { Company } from "@/interfaces/Company";
import { MisionalitySizeCriteria } from "@/interfaces/Dedication";
import { setNextDiagnosisCurrent } from "@/stores/features/utilsSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { companyService } from "@/stores/services/companyService";
import { diagnosisService } from "@/stores/services/diagnosisServices";
import { decryptId, encryptId } from "@/utils/utilsMethods";
import { skipToken } from "@reduxjs/toolkit/query";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { determineCompanySize } from "../utils/functions";
import CompanyHeaderInfo from "./CompanyHeaderInfo";
import ConsultandSelect from "./ConsultandSelect";
import PesvNoteAndSegmented from "./PesvNoteAndSegmented";
import ContinueOrSaveButton from "./ContinueOrSaveButton";

interface Props {
  companyId: number;
  corporate_id?: number;

  onlyInfo?: boolean;
  isOutOfContext?: boolean;
}
export default function CompanyInfo({
  companyId,
  corporate_id,
  onlyInfo,
  isOutOfContext = false,
}: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.util.diagnosisCurrent);
  const stepsLenght = useAppSelector((state) => state.util.stepLenght);
  const [searchParams] = useSearchParams();
  const diagnosisParam = searchParams.get("diagnosis");
  const diagnosisId = diagnosisParam
    ? parseInt(decryptId(diagnosisParam))
    : undefined;

  //States
  const [company, setCompany] = useState<Company | null>(null);
  const [sizeCompany, setSizeCompany] = useState<
    MisionalitySizeCriteria[] | null
  >(null);
  const [consultorSelect, setConsultorSelect] = useState<number | null>(null);
  const [size, setSize] = useState<number>(0);
  const [observationChanged, setObservationChanged] = useState<string | null>(
    null
  );
  const [userChanged, setUserChanged] = useState<boolean>(false);

  //Consultas
  const { data, refetch, isUninitialized } = companyService.useFindByIdQuery(
    companyId ? { id: companyId } : skipToken
  );
  const {
    data: diagnosisDataById,
    refetch: refetchDiagnosis,
    isUninitialized: unitializedDiagnosis,
  } = diagnosisService.useFindByIdQuery(
    diagnosisId ? { diagnosisId } : skipToken
  );
  const { data: sizeData } =
    companyService.useFindcompanySizeByDedicactionIdQuery(
      company ? { id: company.mission_detail.id } : skipToken
    );

  //Mutaciones
  const [saveAnswerCuestions, { isLoading }] =
    diagnosisService.useSaveAnswerCuestionsMutation();
  const [saveCountForCompanyInCorporate, { isLoading: corporateLoading }] =
    diagnosisService.useSaveCountForCompanyInCorporateMutation();
  const [saveDiagnosis] = diagnosisService.useSaveDiagnosisMutation();
  const [updateDiagnosis, { isLoading: updateDiagnosisLoading }] =
    diagnosisService.useUpdateDiagnosisMutation();

  //Storage
  const totalVehicles = useAppSelector(
    (state) => state.vehicleQuestion.totalQuantity
  );
  const totalDrivers = useAppSelector(
    (state) => state.driverQuestion.totalQuantity
  );

  useEffect(() => {
    if (data) setCompany(data);
  }, [data]);

  useEffect(() => {
    if (sizeCompany) {
      setSize(
        determineCompanySize(sizeCompany, totalVehicles, totalDrivers) ?? 0
      );
      setUserChanged(false);
    }
  }, [totalVehicles, totalDrivers]);

  useEffect(() => {
    if (diagnosisDataById) {
      setSize(diagnosisDataById.type_detail.id);
      setObservationChanged(diagnosisDataById.observation);
      setConsultorSelect(diagnosisDataById.consultor_detail?.id ?? null);
    }
  }, [diagnosisDataById]);

  useEffect(() => {
    if (!isUninitialized) refetch();
  }, [isUninitialized, refetch]);

  useEffect(() => {
    if (!unitializedDiagnosis) refetchDiagnosis();
  }, [unitializedDiagnosis, refetchDiagnosis]);

  useEffect(() => {
    if (sizeData) setSizeCompany(sizeData);
  }, [sizeData]);

  const confirm = async () => {
    try {
      switch (current) {
        case 0:
          const data = await saveAnswerCuestions({
            company: companyId,
            vehicleData,
            driverData,
            consultor: consultorSelect ?? 0,
          }).unwrap();
          message.success("Conteo Actualizado correctamente");
          navigate(
            `/app/companies/diagnosis/${encryptId(
              companyId.toString()
            )}?diagnosis=${encryptId(data.diagnosis.toString())}`
          );
          break;
        case 1:
          await saveDiagnosis({
            company: companyId,
            diagnosisDto: diagnosisData,
            diagnosisRequirementDto: diagnosisRequirementData,
            consultor: consultorSelect ?? 0,
            diagnosis: diagnosisId ?? 0,
          }).unwrap();
          refetch();
          refetchDiagnosis();
          dispatch(setNextDiagnosisCurrent());
          message.success("Diagnostico realizado correctamente");
          break;
      }
    } catch (error: any) {
      // Mostrar mensaje de error
      console.log(error);
      message.error(
        "Error interno del sistema, comuniquese con un Administrador"
      );
    }
  };

  const handleUpdateDataOfDiagnosis = async () => {
    try {
      if (!isOutOfContext) {
        await updateDiagnosis({
          id: diagnosisDataById?.id ?? 0,
          type: size,
          observation: observationChanged,
        }).unwrap();

        // ejecutará después de que updateDiagnosis termine
        refetchDiagnosis();
        setUserChanged(false);
      } else {
        await saveCountForCompanyInCorporate({
          company: companyId,
          consultor: consultorSelect ?? 0,
          corporate: corporate_id ?? 0,
          driverData,
          vehicleData,
        });
        message.success("Conteo Actualizado correctamente");
      }
    } catch (error) {
      message.error(
        "Error interno del sistema, comuníquese con un Administrador"
      );
    }
  };

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

  const renderConsultantAndPESV = () => (
    <>
      <ConsultandSelect
        consultorSelect={consultorSelect}
        setConsultorSelect={setConsultorSelect}
      />
      <PesvNoteAndSegmented
        size={size}
        setSize={setSize}
        userChanged={userChanged}
        observationChanged={observationChanged}
        setObservationChanged={setObservationChanged}
        setUserChanged={setUserChanged}
        company={company}
      />
      <ContinueOrSaveButton
        userChanged={userChanged}
        totalGeneral={totalGeneral}
        consultorSelect={consultorSelect}
        isLoading={isLoading}
        confirm={confirm}
        updateDiagnosisLoading={updateDiagnosisLoading}
        handleUpdateDataOfDiagnosis={handleUpdateDataOfDiagnosis}
        isOutOfContext={isOutOfContext}
        corporateLoading={corporateLoading}
      />
    </>
  );

  return (
    <div className="grid grid-cols-6 gap-2 md:sticky top-2 w-full md:w-[30%] md:ml-8">
      <CompanyHeaderInfo company={company} />
      {isOutOfContext && !onlyInfo
        ? renderConsultantAndPESV()
        : current < stepsLenght - 1 && renderConsultantAndPESV()}
    </div>
  );
}
