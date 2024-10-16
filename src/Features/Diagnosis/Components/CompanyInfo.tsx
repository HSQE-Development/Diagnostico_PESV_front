import { Company } from "@/interfaces/Company";
import {
  setNextDiagnosisCurrent,
  setNextExternalCurrent,
} from "@/stores/features/utilsSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { companyService } from "@/stores/services/companyService";
import { diagnosisService } from "@/stores/services/diagnosisServices";
import { decryptId, encryptId } from "@/utils/utilsMethods";
import { skipToken } from "@reduxjs/toolkit/query";
import { message, Segmented, Skeleton } from "antd";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CompanyHeaderInfo from "./CompanyHeaderInfo";
import ConsultandSelect from "./ConsultandSelect";
import ContinueOrSaveButton from "./ContinueOrSaveButton";
import { useCorporate } from "@/context/CorporateGroupContext";
import { corporateGroupService } from "@/stores/services/corporateGroupService";
import { setCheckDiagnosisDataForChanges } from "@/stores/features/diagnosisSlice";
import { ConfigComun } from "@/interfaces/Comun";

const PesvNoteAndSegmented = lazy(() => import("./PesvNoteAndSegmented"));

interface Props extends Partial<ConfigComun> {
  companyId: number;

  onlyInfo?: boolean;
  isOutOfContext?: boolean;
}
export default function CompanyInfo({
  companyId,
  onlyInfo,
  isOutOfContext = false,
  isExternal,
}: Props) {
  const { corporateId } = useCorporate();

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
  const [consultorSelect, setConsultorSelect] = useState<number | null>(null);
  const [size, setSize] = useState<number>(0);
  const [observationChanged, setObservationChanged] = useState<string | null>(
    null
  );
  const [ejecution, setEjecution] = useState<string>("presencial");
  const [userChanged, setUserChanged] = useState<boolean>(false);

  //Consultas
  const { data: corporateData } = corporateGroupService.useFindByIdQuery(
    corporateId ? { id: corporateId } : skipToken
  );

  const { data, refetch, isUninitialized } = companyService.useFindByIdQuery(
    companyId ? { id: companyId } : skipToken
  );
  const {
    data: diagnosisDataById,
    refetch: refetchDiagnosis,
    isUninitialized: unitializedDiagnosis,
  } = diagnosisService.useFindByIdQuery(
    diagnosisId
      ? { diagnosisId }
      : corporateId
      ? { diagnosisId: 0, corporate_group: corporateId }
      : skipToken
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
    if (diagnosisDataById) {
      if (!isOutOfContext) {
        setSize(diagnosisDataById.type_detail?.id ?? 0);
      }
      setObservationChanged(diagnosisDataById.observation);
      setConsultorSelect(diagnosisDataById.consultor_detail?.id ?? null);
      setEjecution(diagnosisDataById.mode_ejecution ?? "presencial");
    }
  }, [diagnosisDataById]);
  useEffect(() => {
    if (!isUninitialized) refetch();
  }, [isUninitialized, refetch]);

  useEffect(() => {
    if (!unitializedDiagnosis) refetchDiagnosis();
  }, [unitializedDiagnosis, refetchDiagnosis]);

  const diagnosisData = useAppSelector(
    (state) => state.diagnosis.diagnosisData
  );
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
          dispatch(setCheckDiagnosisDataForChanges());
          await saveDiagnosis({
            company: companyId,
            diagnosisDto: diagnosisData,
            diagnosisRequirementDto: diagnosisRequirementData,
            consultor: consultorSelect ?? 0,
            diagnosis: diagnosisId ?? 0,
            mode_ejecution: ejecution,
          }).unwrap();
          dispatch(setNextDiagnosisCurrent());
          message.success("Diagnostico realizado correctamente");
          break;
      }
    } catch (error: any) {
      // Mostrar mensaje de error
      //(error);
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
      } else if (isExternal) {
        await saveAnswerCuestions({
          company: companyId,
          vehicleData,
          driverData,
          consultor: consultorSelect ?? 0,
          external_count_complete: true,
        }).unwrap();
        dispatch(setNextExternalCurrent());
        message.success("Conteo Actualizado correctamente");
      } else {
        await saveCountForCompanyInCorporate({
          company: companyId,
          consultor: consultorSelect ?? 0,
          corporate: corporateId ?? 0,
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

  const diagnosisRequirementData = useAppSelector(
    (state) => state.diagnosis.diagnosisRequirementData
  );

  const totalGeneral = totalDrivers + totalVehicles;

  const existCompany = companyId ? true : false;
  const handleSegmentChange = (newEjecution: string) => {
    setEjecution(newEjecution); // Mark that the user has manually changed the segment
  };
  const renderConsultantAndPESV = () => (
    <>
      {!isOutOfContext && (
        <>
          <ConsultandSelect
            consultorSelect={consultorSelect}
            setConsultorSelect={setConsultorSelect}
          />
          <Segmented
            options={[
              {
                label: "Presencial",
                value: "presencial",
              },
              {
                label: "Virtual",
                value: "virtual",
              },
            ]}
            value={ejecution}
            block
            className="col-span-6"
            onChange={handleSegmentChange}
          />
        </>
      )}
      {existCompany && (
        <Suspense
          fallback={
            <>
              <div className="flex w-full">
                <Skeleton className="p-4 w-full" />
              </div>
            </>
          }
        >
          <PesvNoteAndSegmented
            size={size}
            setSize={setSize}
            userChanged={userChanged}
            observationChanged={observationChanged}
            setObservationChanged={setObservationChanged}
            setUserChanged={setUserChanged}
            company={company}
            is_in_count={current == 0 || isOutOfContext ? true : false}
            isExternal={isExternal}
          />
        </Suspense>
      )}
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
        isExternal={isExternal}
      />
    </>
  );

  return (
    <div className="grid grid-cols-6 gap-2 md:sticky top-2 w-full md:w-[30%] md:ml-8">
      <CompanyHeaderInfo
        company={company}
        corporate_group={corporateData}
        isOutOfContext={isOutOfContext}
        isExternal={isExternal}
      />
      {isOutOfContext && !onlyInfo
        ? renderConsultantAndPESV()
        : current < stepsLenght - 1 && renderConsultantAndPESV()}
    </div>
  );
}
