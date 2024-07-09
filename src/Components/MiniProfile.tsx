import { useAppSelector } from "@/stores/hooks";
import { getUservatarUrl } from "@/utils/getUserAvatarImage";
import { Avatar, Badge, Button, Dropdown, MenuProps } from "antd";
import React from "react";
import { CiUser } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

interface MiniProfileProps {
  username: string;
  cargo: string;
}

export default function MiniProfile({ username, cargo }: MiniProfileProps) {
  const navigate = useNavigate();
  const userAuth = useAppSelector((state) => state.auth.authUser);

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
  const avatarUrl = getUservatarUrl(userAuth?.user.avatar ?? undefined);

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
