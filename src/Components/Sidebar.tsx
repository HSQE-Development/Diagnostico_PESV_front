import React from "react";
import LogoXs from "../assets/Logo_xs.png";
import LogoXl from "../assets/Logo_xl.png";
import MenuSide, { MenuSideProps } from "./MenuSide";
import { Button } from "antd";
import { PiSignOutThin } from "react-icons/pi";
import { IoBarChartOutline, IoBusiness } from "react-icons/io5";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/stores/hooks";
import { FaLayerGroup } from "react-icons/fa";

export default function Sidebar() {
  const sideBarState = useAppSelector((state) => state.sidebarState);
  const navigate = useNavigate();

  const menuitems: MenuSideProps[] = [
    {
      icon: <IoBarChartOutline />,
      label: "Dashboard",
      urls: ["/app"],
      onPress: () => navigate("/app"),
    },
    {
      icon: <IoBusiness />,
      label: "Empresas",
      urls: ["/app/companies"],
      onPress: () => navigate("/app/companies"),
    },
    {
      icon: <MdOutlineBusinessCenter />,
      label: "Arls",
      urls: ["/app/arls"],
      onPress: () => navigate("/app/arls"),
    },
    {
      icon: <FaLayerGroup />,
      label: "Grupos Empresariales",
      urls: ["/app/corporate_group"],
      onPress: () => navigate("/app/corporate_group"),
    },
  ];
  return (
    <div
      className={`hidden md:flex flex-col justify-between h-full ${
        sideBarState.isCollapsed ? "md:w-56 lg:w-52" : "md:w-20"
      } transition-all`}
    >
      <div className="flex flex-col overflow-y-auto">
        <div className="w-full flex justify-center items-center h-20 border-b">
          {sideBarState.isCollapsed ? (
            <img src={LogoXl} alt="" className="w-36 pointer-events-none" />
          ) : (
            <img src={LogoXs} alt="" className="w-10 pointer-events-none" />
          )}
        </div>
        <ul
          className={`my-4 flex flex-col ${
            sideBarState.isCollapsed ? "items-start" : "items-center"
          } justify-between p-4 gap-y-4 overflow-x-auto `}
        >
          {menuitems.map((items, i) => (
            <MenuSide
              key={i}
              icon={items.icon}
              label={items.label}
              onPress={items.onPress}
              urls={items.urls}
            />
          ))}
          {/* <MenuSide
          icon={<BsDiagram3Fill />}
          label="Diagnosticos"
          onPress={() => navigate("/app")}
          urls={["/app/companies/diagnosis/"]}
        />
        <MenuSide
          icon={<BsDiagram3Fill />}
          label="Diagnosticos"
          onPress={() => navigate("/app")}
          urls={["/app/companies/diagnosis/"]}
        /> */}
        </ul>
      </div>
      <div className="w-full my-4 flex justify-center items-center">
        <Button size={"large"} icon={<PiSignOutThin />}>
          {sideBarState.isCollapsed ? "Cerrar Sesión" : ""}
        </Button>
      </div>
    </div>
  );
}
