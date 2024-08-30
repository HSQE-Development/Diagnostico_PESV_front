import { useCorporate } from "@/context/CorporateGroupContext";
import { FleetDTO, VehicleQuestion } from "@/interfaces/Company";
import { TableParams } from "@/interfaces/Comun";
import {
  setFleetData,
  setVehicleQuestions,
} from "@/stores/features/vehicleQuestionsSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { companyService } from "@/stores/services/companyService";
import { diagnosisService } from "@/stores/services/diagnosisServices";
import {
  ConfigProvider,
  Input,
  Table,
  TableColumnsType,
  TableProps,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface Props {
  companyId: number;
}
interface DataType extends VehicleQuestion {
  key: React.Key;
}
/**
 *
 * @param companyId El id de la empresa para temas de consulta
 * @returns
 */
export default function Vehiculos({ companyId }: Props) {
  const { corporateId } = useCorporate();
  const dispatch = useAppDispatch();

  const { data: flotaVehiculosTerrestres, refetch } =
    companyService.useFindAllVehicleQuestionsQuery();

  const [searchParams] = useSearchParams();

  const isNewDiagnosis = corporateId
    ? false
    : Boolean(searchParams.get("newDiagnosis") ?? "false");
  const {
    data: fleetByCompany,
    isLoading: isLoadingFleetByCompany,
    refetch: refetchFleet,
    isUninitialized,
  } = diagnosisService.useFindFleetsByCompanyIdQuery({
    companyId,
    corporate_group: corporateId,
  });

  const [inputValues, setInputValues] = useState<{
    [key: number]: {
      owned: number;
      third_party: number;
      arrended: number;
      contractors: number;
      intermediation: number;
      leasing: number;
      renting: number;
      employees: number;
    };
  }>({});

  const [tableParams, setTableParams] = useState<TableParams<DataType>>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    if (!isUninitialized) {
      refetch();
      refetchFleet();
    }
  }, [companyId, isUninitialized, refetch, refetchFleet]);
  useEffect(() => {
    if (flotaVehiculosTerrestres) {
      dispatch(setVehicleQuestions(flotaVehiculosTerrestres));
    }
  }, [flotaVehiculosTerrestres, dispatch]);

  useEffect(() => {
    if (!corporateId) {
      dispatch(setFleetData([]));
    }
  }, [corporateId]);

  useEffect(() => {
    if (fleetByCompany && !isNewDiagnosis && corporateId) {
      const initialInputValues: {
        [key: number]: {
          owned: number;
          third_party: number;
          arrended: number;
          contractors: number;
          intermediation: number;
          leasing: number;
          renting: number;
          employees: number;
        };
      } = {};
      fleetByCompany.forEach((fleet) => {
        initialInputValues[fleet.vehicle_question_detail.id] = {
          owned: fleet.quantity_owned,
          third_party: fleet.quantity_third_party,
          arrended: fleet.quantity_arrended,
          contractors: fleet.quantity_contractors,
          intermediation: fleet.quantity_intermediation,
          leasing: fleet.quantity_leasing,
          renting: fleet.quantity_renting,
          employees: fleet.quantity_employees,
        };
      });
      setInputValues(initialInputValues);
      dispatch(setFleetData(fleetByCompany));
    }
  }, [fleetByCompany]);

  const questionsVehicles = useAppSelector(
    (state) => state.vehicleQuestion.questions
  );
  const vehicleQuestion = useAppSelector((state) => state.vehicleQuestion);

  const handleFleetChange = (
    value: number,
    questionId: number,
    type:
      | "owned"
      | "third_party"
      | "arrended"
      | "contractors"
      | "intermediation"
      | "leasing"
      | "renting"
      | "employees"
  ) => {
    const updatedInputValues = {
      ...inputValues,
      [questionId]: {
        ...inputValues[questionId],
        [type]: value,
      },
    };

    setInputValues(updatedInputValues);
    // Crear una copia del estado actual de fleetData
    const updatedFleetData = [...vehicleQuestion.fleetData];

    // Buscar si ya existe un dato para esta pregunta y tipo
    const existingIndex = updatedFleetData.findIndex(
      (data) => data.vehicle_question === questionId
    );

    if (existingIndex !== -1) {
      // Si existe, crear un nuevo objeto con las propiedades actualizadas
      const updatedData = {
        ...updatedFleetData[existingIndex], // Copiar todas las propiedades del objeto existente
        quantity_owned:
          type === "owned"
            ? value
            : updatedFleetData[existingIndex].quantity_owned,
        quantity_third_party:
          type === "third_party"
            ? value
            : updatedFleetData[existingIndex].quantity_third_party,
        quantity_arrended:
          type === "arrended"
            ? value
            : updatedFleetData[existingIndex].quantity_arrended,
        quantity_contractors:
          type === "contractors"
            ? value
            : updatedFleetData[existingIndex].quantity_contractors,
        quantity_intermediation:
          type === "intermediation"
            ? value
            : updatedFleetData[existingIndex].quantity_intermediation,
        quantity_leasing:
          type === "leasing"
            ? value
            : updatedFleetData[existingIndex].quantity_leasing,
        quantity_renting:
          type === "renting"
            ? value
            : updatedFleetData[existingIndex].quantity_renting,
        quantity_employees:
          type === "employees"
            ? value
            : updatedFleetData[existingIndex].quantity_employees,
      };

      // Reemplazar el objeto existente en el arreglo con el objeto actualizado
      updatedFleetData[existingIndex] = updatedData;
    } else {
      // Si no existe, agregar un nuevo objeto FleetDTO con los valores adecuados
      const newData: FleetDTO = {
        quantity_owned: type === "owned" ? value : 0,
        quantity_third_party: type === "third_party" ? value : 0,
        quantity_arrended: type === "arrended" ? value : 0,
        quantity_contractors: type === "contractors" ? value : 0,
        quantity_intermediation: type === "intermediation" ? value : 0,
        quantity_leasing: type === "leasing" ? value : 0,
        quantity_renting: type === "renting" ? value : 0,
        vehicle_question: questionId,
        quantity_employees: type === "employees" ? value : 0,
        // company: companyId,
      };
      updatedFleetData.push(newData);
    }
    // Actualizar el estado con el nuevo arreglo de fleetData
    dispatch(setFleetData(updatedFleetData));
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "FLOTA DE VEHICULOS AUTOMOTORES",
      dataIndex: "name",
      width: "350px",
    },
    {
      title: "Cantidad Propios",
      width: "10px",

      render: (_, record) => {
        const fleetInfo = inputValues[record.id] || {
          owned: 0,
          third_party: 0,
          arrended: 0,
          contractors: 0,
          intermediation: 0,
          leasing: 0,
          renting: 0,
        };
        return (
          <>
            <Input
              key={record.id}
              value={fleetInfo.owned ?? 0}
              onChange={(e) =>
                handleFleetChange(
                  parseInt(e.target.value) ?? 0,
                  record.id,
                  "owned"
                )
              }
            />
          </>
        );
      },
    },
    {
      title: "Cantidad Terceros",
      width: "10px",
      responsive: ["md"],
      render: (_, record) => {
        const fleetInfo = inputValues[record.id] || {
          third_party: 0,
        };
        // console.log(fleetInfo);
        return (
          <>
            <Input
              key={record.id}
              min={0}
              value={fleetInfo.third_party ?? 0}
              onChange={(e) =>
                handleFleetChange(
                  parseInt(e.target.value) ?? 0,
                  record.id,
                  "third_party"
                )
              }
            />
          </>
        );
      },
    },
    {
      title: "Cantidad Arrendados",
      width: "10px",
      render: (_, record) => {
        const fleetInfo = inputValues[record.id] || {
          arrended: 0,
        };
        // console.log(fleetInfo);
        return (
          <>
            <Input
              key={record.id}
              min={0}
              value={fleetInfo.arrended ?? 0}
              onChange={(e) =>
                handleFleetChange(
                  parseInt(e.target.value) ?? 0,
                  record.id,
                  "arrended"
                )
              }
            />
          </>
        );
      },
    },
    {
      title: "Cantidad Contratistas",
      width: 1,
      render: (_, record) => {
        const fleetInfo = inputValues[record.id] || {
          contractors: 0,
        };
        // console.log(fleetInfo);
        return (
          <>
            <Input
              key={record.id}
              min={0}
              value={fleetInfo.contractors ?? 0}
              onChange={(e) =>
                handleFleetChange(
                  parseInt(e.target.value) ?? 0,
                  record.id,
                  "contractors"
                )
              }
            />
          </>
        );
      },
    },
    {
      title: "Cantidad Intermediación",
      width: 1,
      render: (_, record) => {
        const fleetInfo = inputValues[record.id] || {
          intermediation: 0,
        };
        // console.log(fleetInfo);
        return (
          <>
            <Input
              key={record.id}
              min={0}
              value={fleetInfo.intermediation ?? 0}
              onChange={(e) =>
                handleFleetChange(
                  parseInt(e.target.value) ?? 0,
                  record.id,
                  "intermediation"
                )
              }
            />
          </>
        );
      },
    },
    {
      title: "Cantidad Leasing",
      width: 1,
      render: (_, record) => {
        const fleetInfo = inputValues[record.id] || {
          leasing: 0,
        };
        // console.log(fleetInfo);
        return (
          <>
            <Input
              key={record.id}
              min={0}
              value={fleetInfo.leasing ?? 0}
              onChange={(e) =>
                handleFleetChange(
                  parseInt(e.target.value) ?? 0,
                  record.id,
                  "leasing"
                )
              }
            />
          </>
        );
      },
    },
    {
      title: "Cantidad Renting",
      width: 1,
      render: (_, record) => {
        const fleetInfo = inputValues[record.id] || {
          renting: 0,
        };
        // console.log(fleetInfo);
        return (
          <>
            <Input
              key={record.id}
              min={0}
              value={fleetInfo.renting ?? 0}
              onChange={(e) =>
                handleFleetChange(
                  parseInt(e.target.value) ?? 0,
                  record.id,
                  "renting"
                )
              }
            />
          </>
        );
      },
    },
    {
      title: "Cantidad Vehiculos propios",
      width: 1,
      render: (_, record) => {
        const fleetInfo = inputValues[record.id] || {
          renting: 0,
        };
        // console.log(fleetInfo);
        return (
          <>
            <Input
              key={record.id}
              min={0}
              value={fleetInfo.employees ?? 0}
              onChange={(e) =>
                handleFleetChange(
                  parseInt(e.target.value) ?? 0,
                  record.id,
                  "employees"
                )
              }
            />
          </>
        );
      },
    },
  ];
  const handleTableChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    const isMultipleSort = Array.isArray(sorter);
    setTableParams({
      pagination,
      filters,
      sortOrder: isMultipleSort ? undefined : sorter.order,
      sortField: isMultipleSort ? undefined : sorter.field,
    });
  };
  const dataSource = questionsVehicles.map((question: VehicleQuestion) => ({
    ...question,
    key: question.id,
  }));
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: "#e3e3e3",
          },
        },
      }}
    >
      <Table
        columns={columns}
        pagination={tableParams.pagination}
        dataSource={dataSource}
        size="small"
        onChange={handleTableChange}
        scroll={{ x: "max-content" }}
        showSorterTooltip={{ target: "sorter-icon" }}
        loading={isLoadingFleetByCompany}
        //@ts-ignore
        pagination={false}
        className="w-full"
      />
    </ConfigProvider>
  );
}
