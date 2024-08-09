import FloatLabel from "@/Components/FloatLabel";
import { Company } from "@/interfaces/Company";
import { MisionalitySizeCriteria } from "@/interfaces/Dedication";
import { IUser } from "@/interfaces/IUser";
import {
  setNextDiagnosisCurrent,
  setPrevDiagnosisCurrent,
} from "@/stores/features/utilsSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { companyService } from "@/stores/services/companyService";
import { diagnosisService } from "@/stores/services/diagnosisServices";
import { userService } from "@/stores/services/userService";
import { decryptId } from "@/utils/utilsMethods";
import { skipToken } from "@reduxjs/toolkit/query";
import { Button, Input, message, Popconfirm, Segmented, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { determineCompanySize } from "../utils/functions";
import CompanyHeaderInfo from "./CompanyHeaderInfo";

interface Props {
  companyId: number;
  onlyInfo?: boolean;
}
export default function CompanyInfo({ companyId, onlyInfo }: Props) {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.util.diagnosisCurrent);
  const stepsLenght = useAppSelector((state) => state.util.stepLenght);
  const [filteredConsultands, setFilteredConsultands] = useState<IUser[]>([]);
  const { data: fetchConsultants, isLoading: loadConsultants } =
    userService.useFindAllConsultantsQuery();
  const [searchParams] = useSearchParams();
  const diagnosisParam = searchParams.get("diagnosis");
  const diagnosisId = diagnosisParam
    ? parseInt(decryptId(diagnosisParam))
    : undefined;
  const { data: diagnosisDataById, refetch: refetchDiagnosis } =
    diagnosisService.useFindByIdQuery(
      diagnosisId ? { diagnosisId } : skipToken
    );
  const { data, refetch } = companyService.useFindByIdQuery(
    companyId ? { id: companyId } : skipToken
  );
  const [company, setCompany] = useState<Company | null>(null);
  const [sizeCompany, setSizeCompany] = useState<
    MisionalitySizeCriteria[] | null
  >(null);
  const [saveAnswerCuestions, { isLoading }] =
    diagnosisService.useSaveAnswerCuestionsMutation();

  const [saveDiagnosis] = diagnosisService.useSaveDiagnosisMutation();
  const [consultorSelect, setConsultorSelect] = useState<number | null>(null);

  useEffect(() => {
    if (data) setCompany(data);
  }, [data]);

  const { data: sizeData } =
    companyService.useFindcompanySizeByDedicactionIdQuery(
      company ? { id: company.mission_detail.id } : skipToken
    );
  useEffect(() => {
    if (sizeData) setSizeCompany(sizeData);
  }, [sizeData]);

  const segmentedOptions = sizeCompany?.map((size) => ({
    label: size.size_detail.name, // Assuming CompanySize has a 'name' property
    value: size.size_detail.id, // Assuming CompanySize has an 'id' property
  }));

  useEffect(() => {
    if (diagnosisDataById) {
      setConsultorSelect(diagnosisDataById.consultor_detail?.id ?? null);
    }
  }, [diagnosisDataById]);

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

  useEffect(() => {
    if (fetchConsultants) {
      setFilteredConsultands(fetchConsultants);
    }
  }, [fetchConsultants]);

  useEffect(() => {
    if (sizeCompany) {
      determineCompanySize(sizeCompany, totalVehicles, totalDrivers);
    }
  }, [totalVehicles, totalVehicles]);

  const totalGeneral = totalDrivers + totalVehicles;

  const confirm = async () => {
    try {
      // Intentar eliminar la compañía
      switch (current) {
        case 0:
          // if (
          //   !(diagnosisDataById?.diagnosis_step !== current) &&
          //   !isNewDiagnosis &&
          //   diagnosisDataById?.diagnosis_step
          // ) {
          // }
          await saveAnswerCuestions({
            company: companyId,
            vehicleData,
            driverData,
          }).unwrap();
          refetch();
          message.success("Conteo Actualizado correctamente");
          refetchDiagnosis();

          dispatch(setNextDiagnosisCurrent());
          break;
        case 1:
          await saveDiagnosis({
            company: companyId,
            diagnosisDto: diagnosisData,
            diagnosisRequirementDto: diagnosisRequirementData,
            consultor: consultorSelect ?? 0,
          }).unwrap();
          refetch();
          refetchDiagnosis();
          dispatch(setNextDiagnosisCurrent());
          message.success("Conteo Actualizado correctamente");
          break;
      }
    } catch (error: any) {
      // Mostrar mensaje de error
      console.log(error);
    }
  };

  const onSearchConsultands = (value: string) => {
    const filtered = filteredConsultands?.filter((consultand) => {
      if (consultand.first_name)
        consultand.first_name.toLowerCase().includes(value.toLowerCase());
    });
    setFilteredConsultands(filtered || []);
  };

  const consultandOptions = filteredConsultands.map((consultand) => ({
    value: consultand.id,
    label: consultand.first_name + " " + consultand.last_name,
  }));

  return (
    <div className="grid grid-cols-6 gap-2 sticky top-2  w-[30%] ml-8">
      <CompanyHeaderInfo company={company} />
      {!onlyInfo && (
        <>
          {current < stepsLenght - 1 && (
            <>
              <div className="col-span-6 mt-4">
                <FloatLabel label="Consultor a cargo">
                  <Select
                    showSearch
                    optionFilterProp="label"
                    onSearch={onSearchConsultands}
                    loading={loadConsultants}
                    options={consultandOptions}
                    className="w-full"
                    value={consultorSelect}
                    onChange={(value) => setConsultorSelect(value)}
                  />
                </FloatLabel>
              </div>
              <div className="col-span-6 mt-4">
                <span className="font-bold mr-1">Nota:</span>
                <small>
                  El nivel del PESV es auto calculado, sin embargo si se desea
                  cambiar seleccionar una opción y debe dejar la observacion del
                  por que lo cambia
                </small>
                <Segmented
                  className="mb-2"
                  options={segmentedOptions || []}
                  block
                />
                <Input.TextArea
                  rows={1}
                  placeholder="En caso de que se cambie el nivel sel PESV"
                  autoSize={{ minRows: 1, maxRows: 6 }}
                />
              </div>
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
                  disabled={totalGeneral == 0 || consultorSelect == null}
                  loading={isLoading}
                >
                  Continuar
                </Button>
              </Popconfirm>
            </>
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
