import HeaderTitle from "@/Components/HeaderTitle";
import React from "react";
import { FaFileWaveform } from "react-icons/fa6";
import MainSteper from "./Components/MainSteper";

export default function ExternalPage() {
  return (
    <div className="flex flex-col bg-white w-full h-full rounded-2xl p-2">
      <HeaderTitle
        icon={<FaFileWaveform />}
        title="Caracterización de la empresa"
        subTitle="Ingresa los datos de tu empresa, estos seran confirmados y validados por un ascesor"
      />
      <MainSteper />
    </div>
  );
}
