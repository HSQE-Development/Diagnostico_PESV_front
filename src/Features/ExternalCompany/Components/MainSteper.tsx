import CompanyForm from "@/Features/Companies/Components/CompanyForm";
import { Steps } from "antd";
import React, { useMemo } from "react";
import { FaWpforms } from "react-icons/fa";

export default function MainSteper() {
  const steps = useMemo(() => {
    // Crear un array de pasos condicionalmente
    const stepsArray = [];

    // Añadir los otros pasos
    stepsArray.push(
      {
        title: "Caracterizacón",
        content: <CompanyForm isUseOut />,
        icon: <FaWpforms />,
        subTitle: "Datos de tu empresa ;D",
      },
      {
        title: "Flota vehicular",
        content: <CompanyForm isUseOut />,
        icon: <FaWpforms />,
        subTitle: "Cuantos vehiculos y cuantos conductores tienes?",
      }
    );

    return stepsArray;
  }, []);

  const items = useMemo(
    () =>
      steps.map((item) => ({
        key: item.title,
        title: item.title,
        icon: item.icon,
        subTitle: item.subTitle,
      })),
    [steps]
  );

  const contentToRender = steps[0].content;
  return (
    <>
      <div className="mx-4 mt-4">
        <Steps size="small" current={0} items={items} />
        <div className="mt-4 border-2 border-dashed rounded-xl p-2">
          {contentToRender}
        </div>
      </div>
    </>
  );
}
