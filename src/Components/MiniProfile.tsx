import { Group } from "@/interfaces/Group";
import { clearAuthUser } from "@/stores/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { authService } from "@/stores/services/authService";
import { getUservatarUrl } from "@/utils/getUserAvatarImage";
import { Avatar, Badge, Dropdown, MenuProps } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

interface MiniProfileProps {
  username: string;
  cargo: Group[];
  avatar?: string;
}

export default function MiniProfile({
  username,
  cargo,
  avatar,
}: MiniProfileProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.authUser);
  const [logout] = authService.useLogoutMutation();
  const handleLogout = async () => {
    await logout({
      refresh: authUser?.tokens.refresh ?? "",
    }).unwrap();
    dispatch(clearAuthUser());
    navigate("/login");
  };
  const items: MenuProps["items"] = [
    {
      label: "Perfil",
      key: "1",
      onClick: () => navigate("/app/my_profile"),
    },
    {
      label: "Cerrar Sesión",
      key: "2",
      onClick: () => handleLogout(),
    },
  ];
  const avatarUrl = getUservatarUrl(avatar ?? undefined);
  return (
    <div className="flex justify-evenly items-center gap-x-2 transition-all">
      <div className="flex flex-col items-end transition-all">
        <span className="text-sm">{username}</span>
        <div className="items-center justify-evenly gap-2 hidden sm:flex transition-all">
          {cargo.map((role) => (
            <Badge key={role.id} text={role.name} showZero color="#85CDFA" />
          ))}
        </div>
      </div>
      {/* <Avatar src={<img src={url} alt="avatar" />} /> */}
      <Dropdown
        menu={{ items }}
        placement="bottomLeft"
        arrow={{ pointAtCenter: true }}
      >
        <Avatar src={avatarUrl} alt="User Image" />
        {/* <Button>bottom</Button> */}
      </Dropdown>
    </div>
  );
}
