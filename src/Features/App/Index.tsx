import HeaderTitle from "@/Components/HeaderTitle";
import React from "react";
import { BiChart } from "react-icons/bi";
import ChecklistTrendChart from "./Components/ChecklistTrendChart";
import DiagnosisByCompanyChart from "./Components/DiagnosisByCompanyChart";

export default function MainPage() {
  return (
    <div className="flex flex-col justify-center items-start w-full gap-4">
      <div className="w-full flex flex-col md:flex-row items-center justify-between md:p-8">
        <HeaderTitle
          icon={<BiChart />}
          title="Dashboard"
          subTitle="La info que necesitas y como la necesitas"
        />
      </div>
      <div className="flex w-full flex-col justify-start items-center relative h-[45rem]">
        <div className="absolute w-[80%]  border-2 p-4 rounded-xl flex flex-col justify-start items-start flex-1 shadow-blue-300 shadow-2xl">
          <span className="font-semibold">Tendencia</span>
          <ChecklistTrendChart />
        </div>
        <div className="grid grid-cols-4 gap-4 w-full absolute bottom-0 md:bottom-16">
          <div className="flex flex-col w-full col-span-4 md:col-span-2 lg:col-span-1 bg-zinc-50 border-2 rounded-xl shadow-xl items-center justify-center p-4">
            <DiagnosisByCompanyChart />
          </div>
          <div className="flex flex-col w-full col-span-4 md:col-span-2 lg:col-span-1  bg-white border-2 rounded-xl shadow-xl items-center justify-center p-4"></div>
          <div className="flex flex-col w-full col-span-4 md:col-span-2 lg:col-span-1  bg-white border-2 rounded-xl shadow-xl items-center justify-center p-4"></div>
          <div className="flex flex-col w-full col-span-4 md:col-span-2 lg:col-span-1  bg-white border-2 rounded-xl shadow-xl items-center justify-center p-4"></div>
        </div>
      </div>
    </div>
  );
}
