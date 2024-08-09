import { IUser } from "@/interfaces/IUser";
import { useAppSelector } from "@/stores/hooks";
import {
  getColorByRole,
  getFullName,
  getUservatarUrl,
} from "@/utils/getUserAvatarImage";
import { Avatar, Badge, Popover } from "antd";
import React from "react";

interface InfoConsultorsProps {
  consultand: IUser | null;
}

export default function InfoConsultors({ consultand }: InfoConsultorsProps) {
  const avatarUrl = getUservatarUrl(consultand?.avatar ?? undefined);
  const authId = useAppSelector((state) => state.auth.authUser?.user.id);
  const fullName = consultand
    ? `${consultand.first_name} ${consultand.last_name}`
    : "";
  return (
    <Popover
      placement="left"
      content={<DetailInfoConsultors consultand={consultand} />}
      title="Información detallada"
    >
      <div className="flex items-center justify-start gap-1">
        <Avatar src={avatarUrl} />
        <span className="text-xs">{fullName.toUpperCase()}</span>
        {authId === consultand?.id && <Badge count={"Yo"} color="#faad14" />}
      </div>
    </Popover>
  );
}

function DetailInfoConsultors({ consultand }: InfoConsultorsProps) {
  const avatarUrl = getUservatarUrl(consultand?.avatar ?? "");
  const fullName = getFullName(consultand);

  return (
    <div className="p-2 flex flex-col">
      <div className="flex justify-start w-full items-center gap-2 mb-4">
        <Avatar src={avatarUrl} size={"large"} />
        <div className="flex flex-col items-start justify-evenly">
          <span>{fullName.toUpperCase()}</span>
          <div className="flex justify-start items-center gap-1">
            {consultand?.groups_detail.map((group, index) => (
              <Badge
                key={index}
                count={group.name}
                color={getColorByRole(group.name).hex}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 grid-rows-2 gap-2">
        <InfoCard title="Cedula" value={consultand?.cedula || "N/A"} />
        <InfoCard title="Email" value={consultand?.email || "N/A"} />
        <InfoCard
          title="Licencia SST"
          value={consultand?.licensia_sst || "N/A"}
        />
      </div>
    </div>
  );
}

interface InfoCardProps {
  title: string;
  value: string;
}

function InfoCard({ title, value }: InfoCardProps) {
  return (
    <div className="col-span-2 bg-gradient-to-r from-slate-100 to-gray-100 row-span-1 rounded-md p-2">
      <div className="flex justify-start items-center gap-2">
        <span className="font-bold">{title}:</span>
        <span>{value}</span>
      </div>
    </div>
  );
}
