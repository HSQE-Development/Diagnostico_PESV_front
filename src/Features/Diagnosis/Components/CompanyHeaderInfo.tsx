import HeaderTitle from "@/Components/HeaderTitle";
import { Company } from "@/interfaces/Company";
import { useAppSelector } from "@/stores/hooks";
import { formatNIT } from "@/utils/utilsMethods";
import { Statistic } from "antd";
import React from "react";
import { FaCar, FaVoicemail } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { GiSevenPointedStar } from "react-icons/gi";
import { HiIdentification } from "react-icons/hi";
import { IoBusiness } from "react-icons/io5";
import { MdEmojiPeople, MdOutlineAlternateEmail } from "react-icons/md";

export default function CompanyHeaderInfo({
  company,
}: {
  company: Company | null;
}) {
  const totalVehicles = useAppSelector(
    (state) => state.vehicleQuestion.totalQuantity
  );
  const totalDrivers = useAppSelector(
    (state) => state.driverQuestion.totalQuantity
  );
  return (
    <>
      <div className="col-span-6 ">
        <HeaderTitle
          icon={<IoBusiness />}
          title="Flota Vehicular"
          subTitle="Diagnostico sobre la flota vehicular de la empresa"
          isGrid
        />
      </div>
      <div className="w-full bg-gradient-to-r from-zinc-100 to-sky-50 rounded-xl p-4 col-span-6 flex flex-col items-start justify-start">
        <div className="flex items-center justify-around w-full my-2 flex-wrap">
          <div className="flex items-center justify-start gap-2">
            <IoBusiness />
            {company?.name}
          </div>
          {/* <InfoConsultors
            consultand={company ? company.company_diagnosis.consultor_detail : null}
          /> */}
          <div className=" col-span-2  flex items-center">
            <HiIdentification className="font-bold text-xl" />
            <span className="text-sm p-2">{formatNIT(company?.nit ?? "")}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 border-l-4 border-black pl-4">
          <div className=" col-span-2  flex items-center">
            <MdOutlineAlternateEmail className="font-bold text-xl" />
            <span className="text-sm p-2">{company?.email}</span>
          </div>
          <div className="col-span-2  flex items-center">
            <GiSevenPointedStar className="font-bold text-xl" />
            <div className="flex flex-col justify-start items-start">
              <small className="font-bold">Misionalidad</small>
              <span className="text-sm p-2">
                {company?.mission_detail.name}
              </span>
            </div>
          </div>

          {/* <div className=" col-span-2 flex items-center  ">
            <FaPeopleCarry className="font-bold text-xl" />
            <div className="flex flex-col justify-start items-start">
              <small className="font-bold">Tamaño (Nivel del pesv)</small>
              <Popover
                placement="topLeft"
                title={
                  company?.misionality_size_criteria?.map(
                    (cri) => cri.criteria_detail?.name
                  ) ?? <Badge status="default" count="Por definirse" />
                }
              >
                <span className="text-sm  p-2 ">
                  {company?.size_detail?.name ?? (
                    <Badge status="default" count="Por definirse" />
                  )}
                </span>
              </Popover>
            </div>
          </div> */}
          <div className="col-span-2 flex items-center w-full justify-between">
            <FaPeopleGroup />
            <span className="text-sm p-2">{company?.dependant}</span> -
            <FaVoicemail className="ml-1" />
            <span className="text-sm p-2">{company?.dependant_phone}</span>
          </div>
        </div>
      </div>
      <div className="col-span-6 flex items-center justify-center gap-8">
        <div className="p-2 bg-gray-100 px-8 rounded-xl w-2/4">
          <Statistic
            title="Total Vehìculos"
            value={totalVehicles}
            valueStyle={{ color: "#3f8600" }}
            prefix={<FaCar />}
            className="w-full"
          />
        </div>
        <div className="p-2 bg-gray-100 px-8 rounded-xl w-2/4">
          <Statistic
            title="Total Conductores"
            value={totalDrivers}
            valueStyle={{ color: "#3f8600" }}
            prefix={<MdEmojiPeople />}
            className="w-full"
          />
        </div>
      </div>
    </>
  );
}
