import FloatLabel from "@/Components/FloatLabel";
import { Company } from "@/interfaces/Company";
import { MisionalitySizeCriteria } from "@/interfaces/Dedication";
import { IUser } from "@/interfaces/IUser";
import { setNextDiagnosisCurrent } from "@/stores/features/utilsSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { companyService } from "@/stores/services/companyService";
import { diagnosisService } from "@/stores/services/diagnosisServices";
import { userService } from "@/stores/services/userService";
import { decryptId, encryptId } from "@/utils/utilsMethods";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  Button,
  ConfigProvider,
  Input,
  message,
  Popconfirm,
  Segmented,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { determineCompanySize } from "../utils/functions";
import CompanyHeaderInfo from "./CompanyHeaderInfo";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";

interface Props {
  companyId: number;
  onlyInfo?: boolean;
}
export default function CompanyInfo({ companyId, onlyInfo }: Props) {
  const navigate = useNavigate();
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
  const [updateDiagnosis, { isLoading: updateDiagnosisLoading }] =
    diagnosisService.useUpdateDiagnosisMutation();
  const [consultorSelect, setConsultorSelect] = useState<number | null>(null);
  const [size, setSize] = useState<number>(0);
  const [userChanged, setUserChanged] = useState<boolean>(false);
  const [observationChanged, setObservationChanged] = useState<string | null>(
    diagnosisDataById?.observation ?? null
  );

  useEffect(() => {
    refetchDiagnosis();
    refetch();
  }, [dispatch]);
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
    }
  }, [diagnosisDataById]);

  const handleSegmentChange = (newSize: number) => {
    setSize(newSize);
    setUserChanged(true); // Mark that the user has manually changed the segment
  };

  const totalGeneral = totalDrivers + totalVehicles;

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
      await updateDiagnosis({
        id: diagnosisDataById?.id ?? 0,
        type: size,
        observation: observationChanged,
      }).unwrap();

      // ejecutará después de que updateDiagnosis termine
      refetchDiagnosis();
      setUserChanged(false);
    } catch (error) {
      message.error(
        "Error interno del sistema, comuníquese con un Administrador"
      );
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

  const defaultColors = {
    itemActiveBg: "#007bff",
    itemColor: "#000",
    itemHoverBg: "#f0f0f0",
    itemHoverColor: "#333333",
    itemSelectedBg: "#ffffff",
    itemSelectedColor: "#fff",
    trackBg: "#f5f5f5",
  };
  const conditionalColors: any = {
    1: {
      itemActiveBg: "#28a745",
      itemColor: "#BABABA",
      itemSelectedBg: "#6cffc3",
      itemSelectedColor: "#fff",
    },
    2: {
      itemActiveBg: "#6c91ff",
      itemColor: "#BABABA",
      itemSelectedBg: "#6c91ff",
      itemSelectedColor: "#fff",
    },
    3: {
      itemActiveBg: "#ffc107",
      itemColor: "#BABABA",
      itemSelectedBg: "#ff6c6c",
      itemSelectedColor: "#fff",
    },
  };
  const colors = conditionalColors[size] || defaultColors;
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
                  cambiar debe seleccionar una opción y dejar la observacion del
                  por que lo cambia
                </small>
                <ConfigProvider
                  theme={{
                    components: {
                      Segmented: {
                        ...colors,
                      },
                    },
                  }}
                >
                  <Segmented
                    className="mb-2"
                    options={segmentedOptions || []}
                    block
                    value={size}
                    onChange={handleSegmentChange}
                  />
                </ConfigProvider>
                {/* Conditionally render the TextArea if the user manually changed the segment */}
                {userChanged && (
                  <Input.TextArea
                    rows={1}
                    placeholder="En caso de que se cambie el nivel del PESV"
                    autoSize={{ minRows: 1, maxRows: 6 }}
                    value={observationChanged ?? ""}
                    onChange={(e) =>
                      setObservationChanged(
                        e.target.value == "" ? null : e.target.value
                      )
                    }
                  />
                )}
              </div>
              {!userChanged ? (
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
                    icon={<LiaLongArrowAltRightSolid />}
                    iconPosition="end"
                  >
                    Continuar
                  </Button>
                </Popconfirm>
              ) : (
                <Button
                  onClick={async () => await handleUpdateDataOfDiagnosis()}
                  className="col-span-6 bg-orange-400 text-white border-orange-400 active:bg-orange-700 hover:bg-orange-300"
                  loading={updateDiagnosisLoading}
                >
                  Guardar Cambios
                </Button>
              )}
            </>
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
