import { DriverDTO } from "@/interfaces/Company";
import {
  setDriverData,
  setDriverQuestions,
} from "@/stores/features/driverQuestionSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { companyService } from "@/stores/services/companyService";
import { Collapse, CollapseProps, InputNumber, theme } from "antd";
import React, { CSSProperties, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface Props {
  companyId: number;
}
export default function Conductores({ companyId }: Props) {
  const dispatch = useAppDispatch();
  const driverQuestion = useAppSelector((state) => state.driverQuestion);
  const { data: conductoresPreguntas } =
    companyService.useFindAllDriverQuestionsQuery();

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
  const { token } = theme.useToken();
  const panelStyle: React.CSSProperties = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
    display: "flex",
    flexDirection: "column",
  };

  const personasConducenItems: (
    panelStyle: CSSProperties
  ) => CollapseProps["items"] = (panelStyle) => [
    {
      key: "1",
      label: (
        <>
          <div className="grid grid-cols-6 w-full border-b-2 ">
            <div className="col-span-4">
              <span className="text-sm">
                PERSONAS QUE CONDUCEN CON FINES MISIONALES
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-sm">CANTIDAD</span>
            </div>
          </div>
        </>
      ),
      children: (
        <>
          <div className="grid grid-cols-6 gap-2 place-content-start items-center">
            {driverQuestion.questions.map((question) => (
              <React.Fragment key={question.id}>
                <div className="col-span-4 ml-8">
                  <span>{question.name}</span>
                </div>
                <div className="col-span-2">
                  <InputNumber
                    min={0}
                    defaultValue={0}
                    className="w-full"
                    onChange={(value) =>
                      handleFleetChange(value ?? 0, question.id, "general")
                    }
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        </>
      ),
      style: panelStyle,
    },
  ];

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={["1"]}
      expandIcon={({ isActive }) => (
        <IoIosArrowDown
          rotate={isActive ? 90 : 0}
          className={`${
            isActive ? "rotate-180" : "rotate-0"
          } flex items-center`}
        />
      )}
      style={{ background: token.colorBgContainer }}
      items={personasConducenItems(panelStyle)}
    />
  );
}
