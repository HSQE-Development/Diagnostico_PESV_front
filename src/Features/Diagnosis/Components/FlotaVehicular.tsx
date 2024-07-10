import HeaderTitle from "@/Components/HeaderTitle";
import { DriverDTO, FleetDTO } from "@/interfaces/Company";
import {
  setFleetData,
  setVehicleQuestions,
  updateFleetData,
} from "@/stores/features/vehicleQuestionsSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { companyService } from "@/stores/services/companyService";
import {
  Collapse,
  CollapseProps,
  InputNumber,
  Popover,
  Statistic,
  theme,
} from "antd";
import React, { CSSProperties, useEffect, useState } from "react";
import { FaCar } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoBusiness } from "react-icons/io5";
import { MdEmojiPeople } from "react-icons/md";

export default function FlotaVehicular({ companyId }: { companyId: number }) {
  const [responsesDriver, setResponsesDriver] = useState<DriverDTO[]>([]);

  const { data: conductoresPreguntas } =
    companyService.useFindAllDriverQuestionsQuery();

  const { data: flotaVehiculosTerrestres } =
    companyService.useFindAllVehicleQuestionsQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (flotaVehiculosTerrestres) {
      dispatch(setVehicleQuestions(flotaVehiculosTerrestres));
    }
  }, [flotaVehiculosTerrestres, dispatch]);

  const questionsVehicles = useAppSelector(
    (state) => state.vehicleQuestion.questions
  );
  const vehicleQuestion = useAppSelector((state) => state.vehicleQuestion);
  const totalVehicles = useAppSelector(
    (state) => state.vehicleQuestion.totalQuantity
  );

  const handleFleetChange = (
    value: number,
    questionId: number,
    type: "owned" | "third_party"
  ) => {
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
      };

      // Reemplazar el objeto existente en el arreglo con el objeto actualizado
      updatedFleetData[existingIndex] = updatedData;
    } else {
      // Si no existe, agregar un nuevo objeto FleetDTO con los valores adecuados
      const newData: FleetDTO = {
        quantity_owned: type === "owned" ? value : 0,
        quantity_third_party: type === "third_party" ? value : 0,
        vehicle_question: questionId,
        company: companyId,
      };
      updatedFleetData.push(newData);
    }

    // Actualizar el estado con el nuevo arreglo de fleetData
    dispatch(setFleetData(updatedFleetData));
  };
  const handleDriverChange = (
    questionId: number,
    type: keyof DriverDTO,
    value: number
  ) => {
    setResponsesDriver((prevResponses) => {
      const updatedResponses = [...prevResponses];
      const responseIndex = updatedResponses.findIndex(
        (response) => response.driver_question === questionId
      );

      if (responseIndex > -1) {
        updatedResponses[responseIndex][type] = value;
      } else {
        const newResponse: DriverDTO = {
          driver_question: questionId,
          quantity: 0,
          company: 1, // Replace with actual company ID
        };
        newResponse[type] = value;
        updatedResponses.push(newResponse);
      }

      return updatedResponses;
    });
  };
  const { token } = theme.useToken();
  const panelStyle: React.CSSProperties = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
    display: "flex",
    flexDirection: "column",
  };

  const flotaVehiculosItems: (
    panelStyle: CSSProperties
  ) => CollapseProps["items"] = (panelStyle) => [
    {
      key: "1",
      label: (
        <>
          <div className="grid grid-cols-6 w-full border-b-2 ">
            <div className="col-span-4">
              <span className="text-sm">FLOTA DE VEHICULOS AUTOMOTORES</span>
            </div>
            <div className="col-span-1">
              <span className="text-sm">CANTIDAD PROPIOS</span>
            </div>
            <div className="col-span-1">
              <Popover
                content={
                  <small>
                    (Arrendados, contratistas, intermediación, leasing, renting)
                  </small>
                }
              >
                <span className="text-sm flex flex-col justify-center items-start">
                  CANTIDAD TERCEROS
                </span>
              </Popover>
            </div>
          </div>
        </>
      ),
      children: (
        <>
          <div className="grid grid-cols-6 gap-2 place-content-start items-center">
            {questionsVehicles.map((question) => (
              <React.Fragment key={question.id}>
                <div className="col-span-4 ml-8">
                  <span>{question.name}</span>
                </div>
                <div className="col-span-1">
                  <InputNumber
                    min={0}
                    defaultValue={0}
                    className="w-full"
                    onChange={(value) =>
                      handleFleetChange(value ?? 0, question.id, "owned")
                    }
                  />
                </div>
                <div className="col-span-1">
                  <InputNumber
                    min={0}
                    defaultValue={0}
                    className="w-full"
                    onChange={(value) =>
                      handleFleetChange(value ?? 0, question.id, "third_party")
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
            {conductoresPreguntas?.map((question) => (
              <>
                <div className="col-span-4 ml-8">
                  <span>{question.name}</span>
                </div>
                <div className="col-span-2">
                  <InputNumber
                    min={0}
                    defaultValue={0}
                    className="w-full"
                    onChange={(value) =>
                      handleDriverChange(question.id, "quantity", value ?? 0)
                    }
                  />
                </div>
              </>
            ))}
          </div>
        </>
      ),
      style: panelStyle,
    },
  ];
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4">
        <HeaderTitle
          icon={<IoBusiness />}
          title="Flota Vehicular"
          subTitle="Diagnostico sobre la flota vehicular de la empresa"
        />
        <div className="flex items-center justify-start gap-8  top-20">
          <div className="p-2 bg-gray-100 px-8 rounded-xl">
            <Statistic
              title="Total Vehìculos"
              value={totalVehicles}
              valueStyle={{ color: "#3f8600" }}
              prefix={<FaCar />}
            />
          </div>
          <div className="p-2 bg-gray-100 px-8 rounded-xl">
            <Statistic
              title="Total Conductores"
              value={0}
              valueStyle={{ color: "#3f8600" }}
              prefix={<MdEmojiPeople />}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col">
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
          items={flotaVehiculosItems(panelStyle)}
        />

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
      </div>
    </div>
  );
}
