import HeaderTitle from "@/Components/HeaderTitle";
import { useCorporate } from "@/context/CorporateGroupContext";
import { Company } from "@/interfaces/Company";
import { ICorporateGroup } from "@/interfaces/CorporateGroup";
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

type CompanyHeaderDataProps = {
  company: Company | null;
  corporate_group?: ICorporateGroup;
  corporateId?: number;
  isInfo?: boolean;
};

const CompanyHeaderData: React.FC<CompanyHeaderDataProps> = (props) => {
  return (
    <div
      className={`w-full  rounded-xl ${
        props.corporate_group
          ? "py-0 px-4 bg-gradient-to-r from-zinc-100 to-sky-50"
          : props.isInfo
          ? "p-0 bg-zinc-100"
          : "bg-gradient-to-r from-zinc-100 to-sky-50 p-4 "
      } col-span-6 flex flex-col items-start justify-start`}
    >
      <div className="flex items-center justify-around w-full my-2 flex-wrap">
        <div className="flex items-center justify-start gap-2">
          <IoBusiness />
          {props.company
            ? props.company.name
            : props.corporate_group
            ? props.corporate_group.name
            : ""}
        </div>
        {/* <InfoConsultors
            consultand={company ? company.company_diagnosis.consultor_detail : null}
          /> */}
        <div className=" col-span-2  flex items-center">
          <HiIdentification className="font-bold text-xl" />
          <span className="text-sm p-2">
            {props.company
              ? formatNIT(props.company.nit)
              : props.corporate_group
              ? formatNIT(props.corporate_group.nit)
              : ""}
          </span>
        </div>
      </div>

      {!props.corporateId && (
        <div className="grid grid-cols-2 gap-2 border-l-4 border-black pl-4">
          <div className=" col-span-2  flex items-center">
            <MdOutlineAlternateEmail className="font-bold text-xl" />
            <span className="text-sm p-2">{props.company?.email}</span>
          </div>
          <div className="col-span-2  flex items-center">
            <GiSevenPointedStar className="font-bold text-xl" />
            <div className="flex flex-col justify-start items-start">
              <small className="font-bold">Misionalidad</small>
              <span className="text-sm p-2">
                {props.company?.mission_detail.name}
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
            <span className="text-sm p-2">{props.company?.dependant}</span> -
            <FaVoicemail className="ml-1" />
            <span className="text-sm p-2">
              {props.company?.dependant_phone}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function CompanyHeaderInfo({
  company,
  corporate_group,
  isOutOfContext,
}: {
  company: Company | null;
  corporate_group?: ICorporateGroup;
  isOutOfContext?: boolean;
}) {
  const { corporateId } = useCorporate();

  const totalVehicles = useAppSelector(
    (state) => state.vehicleQuestion.totalQuantity
  );
  const totalDrivers = useAppSelector(
    (state) => state.driverQuestion.totalQuantity
  );
  console.log(company);
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
      <CompanyHeaderData
        company={company}
        corporate_group={corporate_group}
        corporateId={corporateId}
      />
      {!company && (
        <div className="w-full col-span-6 flex flex-col gap-2">
          <span>Empresas:</span>
          <div className="flex flex-col gap-2 ml-8">
            {corporate_group?.company_diagnoses_corporate.map((group) => (
              <CompanyHeaderData
                key={group.id}
                company={group.company_detail}
                corporateId={corporateId}
                isInfo
              />
            ))}
          </div>
        </div>
      )}
      {!corporateId ||
        (isOutOfContext && company && (
          <div className="col-span-6 flex items-center justify-center gap-2">
            <div className=" bg-gray-100 rounded-xl w-1/2 h-24">
              <Statistic
                title="Total Vehìculos"
                value={totalVehicles}
                valueStyle={{ color: "#3f8600" }}
                prefix={<FaCar />}
                className="w-full h-full flex flex-col justify-center items-center"
              />
            </div>
            <div className=" bg-gray-100 rounded-xl w-1/2 h-24">
              <Statistic
                title="Total Conductores"
                value={totalDrivers}
                valueStyle={{ color: "#3f8600" }}
                prefix={<MdEmojiPeople />}
                className="w-full h-full flex flex-col justify-center items-center"
              />
            </div>
          </div>
        ))}
    </>
  );
}
