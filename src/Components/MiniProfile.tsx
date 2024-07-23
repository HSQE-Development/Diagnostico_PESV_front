import { getUservatarUrl } from "@/utils/getUserAvatarImage";
import { Avatar, Badge, Dropdown, MenuProps } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

interface MiniProfileProps {
  username: string;
  cargo: string;
  avatar?: string;
}

export default function MiniProfile({
  username,
  cargo,
  avatar,
}: MiniProfileProps) {
  const navigate = useNavigate();

  const items: MenuProps["items"] = [
    {
      label: "Perfil",
      key: "1",
      onClick: () => navigate("/app/my_profile"),
    },
    {
      label: "Cerrar Sesión",
      key: "2",
      onClick: () => navigate("/login"),
    },
  ];
  const avatarUrl = getUservatarUrl(avatar ?? undefined);
  return (
    <div className="flex justify-evenly items-center gap-x-2">
      <div className="flex flex-col items-end">
        <span className="font-bold text-sm">{username}</span>
        <Badge text={cargo} showZero color="#faad14" />
      </div>
      {/* <Avatar src={<img src={url} alt="avatar" />} /> */}
      <Dropdown
        menu={{ items }}
        placement="bottom"
        arrow={{ pointAtCenter: true }}
      >
        <Avatar src={avatarUrl} />
        {/* <Button>bottom</Button> */}
      </Dropdown>
    </div>
  );
}
