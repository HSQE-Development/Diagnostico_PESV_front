import { useCorporate } from "@/context/CorporateGroupContext";
import { DriverDTO, DriverQuestion } from "@/interfaces/Company";
import { TableParams } from "@/interfaces/Comun";
import {
  setDriverData,
  setDriverQuestions,
} from "@/stores/features/driverQuestionSlice";
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
interface DataType extends DriverQuestion {
  key: React.Key;
}
/**
 *
 * @param companyId El id de la empresa para temas de consulta
 * @returns
 */
export default function Conductores({ companyId }: Props) {
  const { corporateId } = useCorporate();
  const dispatch = useAppDispatch();

  const { data: conductoresPreguntas, refetch } =
    companyService.useFindAllDriverQuestionsQuery();

  const [searchParams] = useSearchParams();

  const isNewDiagnosis = corporateId
    ? false
    : Boolean(searchParams.get("newDiagnosis") ?? "false");
  const {
    data: driverByCompanyid,
    isLoading: isLoadingDriverByCompany,
    refetch: refetchDriver,
    isUninitialized,
  } = diagnosisService.useFindDriversByCompanyIdQuery({
    companyId,
    corporate_group: corporateId,
  });
  const [inputValues, setInputValues] = useState<{
    [key: number]: {
      quantity: number;
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
      refetchDriver();
    }
  }, [companyId, isUninitialized]);
  useEffect(() => {
    if (conductoresPreguntas) {
      dispatch(setDriverQuestions(conductoresPreguntas));
    }
  }, [conductoresPreguntas, dispatch]);

  useEffect(() => {
    if (!corporateId) {
      dispatch(setDriverData([]));
    }
  }, [corporateId]);
  useEffect(() => {
    if (driverByCompanyid && !isNewDiagnosis && corporateId) {
      const initialInputValues: {
        [key: number]: {
          quantity: number;
        };
      } = {};
      driverByCompanyid.forEach((driver) => {
        initialInputValues[driver.driver_question_detail.id] = {
          quantity: driver.quantity,
        };
      });
      setInputValues(initialInputValues);
      dispatch(setDriverData(driverByCompanyid));
    }
  }, [driverByCompanyid]);

  const questionDriver = useAppSelector(
    (state) => state.driverQuestion.questions
  );
  const driverQuestion = useAppSelector((state) => state.driverQuestion);

  const handleDriverChange = (value: number, questionId: number) => {
    const updatedInputValues = {
      ...inputValues,
      [questionId]: {
        ...inputValues[questionId],
        quantity: value,
      },
    };
    setInputValues(updatedInputValues);
    // Crear una copia del estado actual de fleetData
    const updateDriverData = [...driverQuestion.driverData];

    // Buscar si ya existe un dato para esta pregunta y tipo
    const existingIndex = updateDriverData.findIndex(
      (data) => data.driver_question === questionId
    );

    if (existingIndex !== -1) {
      // Si existe, crear un nuevo objeto con las propiedades actualizadas
      const updatedData = {
        ...updateDriverData[existingIndex], // Copiar todas las propiedades del objeto existente
        quantity: value ?? updateDriverData[existingIndex].quantity,
      };

      // Reemplazar el objeto existente en el arreglo con el objeto actualizado
      updateDriverData[existingIndex] = updatedData;
    } else {
      // Si no existe, agregar un nuevo objeto FleetDTO con los valores adecuados
      const newData: DriverDTO = {
        quantity: value ?? 0,
        driver_question: questionId,
      };
      updateDriverData.push(newData);
    }

    // Actualizar el estado con el nuevo arreglo de fleetData
    dispatch(setDriverData(updateDriverData));
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "PERSONAS QUE CONDUCEN CON FINES MISIONALES",
      dataIndex: "name",
      width: "350px",
    },
    {
      title: "Cantidad",
      width: 1,
      render: (_, record) => {
        const driverInfo = inputValues[record.id] || {
          quantity: 0,
        };
        return (
          <>
            <Input
              key={record.id}
              value={driverInfo.quantity ?? 0}
              onChange={(e) => {
                const value = e.target.value;
                handleDriverChange(
                  value === "" ? 0 : parseInt(value, 10) || 0,
                  record.id
                );
              }}
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

  const dataSource = questionDriver.map((question: DriverQuestion) => ({
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
        loading={isLoadingDriverByCompany}
        //@ts-ignore
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30"],
        }}
      />
    </ConfigProvider>
  );
}
