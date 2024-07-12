import { DriverDTO, DriverQuestion } from "@/interfaces/Company";
import { TableParams } from "@/interfaces/Comun";
import {
  setDriverData,
  setDriverQuestions,
} from "@/stores/features/driverQuestionSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { companyService } from "@/stores/services/companyService";
import { Input, Table, TableColumnsType, TableProps } from "antd";
import React, { useEffect, useState } from "react";

interface Props {
  companyId: number;
}
interface DataType extends DriverQuestion {
  key: React.Key;
}

export default function Conductores({ companyId }: Props) {
  const dispatch = useAppDispatch();
  const { data: conductoresPreguntas } =
    companyService.useFindAllDriverQuestionsQuery();

  const { data: driverByCompanyid, isLoading: isLoadingDriverByCompany } =
    companyService.useFindDriversByCompanyIdQuery({ companyId });
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
    if (driverByCompanyid && !isLoadingDriverByCompany) {
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
  }, [driverByCompanyid, isLoadingDriverByCompany]);

  const driverQuestion = useAppSelector((state) => state.driverQuestion);

  useEffect(() => {
    if (conductoresPreguntas) {
      dispatch(setDriverQuestions(conductoresPreguntas));
    }
  }, [conductoresPreguntas, dispatch]);

  const handleFleetChange = (
    value: number,
    questionId: number,
    type: "general"
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
    const updateDriverData = [...driverQuestion.driverData];

    // Buscar si ya existe un dato para esta pregunta y tipo
    const existingIndex = updateDriverData.findIndex(
      (data) => data.driver_question === questionId
    );

    if (existingIndex !== -1) {
      // Si existe, crear un nuevo objeto con las propiedades actualizadas
      const updatedData = {
        ...updateDriverData[existingIndex], // Copiar todas las propiedades del objeto existente
        quantity:
          type === "general" ? value : updateDriverData[existingIndex].quantity,
      };

      // Reemplazar el objeto existente en el arreglo con el objeto actualizado
      updateDriverData[existingIndex] = updatedData;
    } else {
      // Si no existe, agregar un nuevo objeto FleetDTO con los valores adecuados
      const newData: DriverDTO = {
        quantity: type === "general" ? value : 0,
        driver_question: questionId,
        company: companyId,
      };
      updateDriverData.push(newData);
    }

    // Actualizar el estado con el nuevo arreglo de fleetData
    dispatch(setDriverData(updateDriverData));
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "PERSONAS QUE CONDUCEN CON FINES MISIONALES",
      dataIndex: ["name"],
      width: "350px",
      fixed: "left",
    },
    {
      title: "Cantidad",
      width: 1,
      render: (_, record) => {
        const driverInfo = inputValues[record.id] || {
          quantity: 0,
        };
        // console.log(fleetInfo);
        return (
          <React.Fragment key={record.id}>
            <Input
              min={0}
              value={driverInfo.quantity ?? 0}
              onChange={(e) =>
                handleFleetChange(
                  parseInt(e.target.value) ?? 0,
                  record.id,
                  "general"
                )
              }
            />
          </React.Fragment>
        );
      },
    },
  ];

  const dataSource = driverQuestion.questions.map(
    (question: DriverQuestion) => ({
      ...question,
      key: question.id,
    })
  );

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
  return (
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
  );
}
