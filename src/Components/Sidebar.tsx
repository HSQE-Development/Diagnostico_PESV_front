import React, { useMemo } from "react";
import MenuSide, { MenuSideProps } from "./MenuSide";
import { Button, Skeleton } from "antd";
import { PiSignOutThin } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import clsx from "clsx";

// Imágenes importadas normalmente
import LogoXs from "../assets/Logo_xs.png";
import LogoXl from "../assets/Logo_xl.png";
import { CiMenuBurger } from "react-icons/ci";
import { setCollapsed } from "@/stores/features/sideBarSlice";
import { authService } from "@/stores/services/authService";
import { clearAuthUser } from "@/stores/features/authSlice";

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.authUser);
  const [logout, { isLoading }] = authService.useLogoutMutation();
  const { isCollapsed } = useAppSelector((state) => state.sidebarState);
  const {
    data: menuData,
    isLoading: menuLoading,
    isFetching: menufetching,
  } = authService.useMenusByGrupsQuery({
    groups: authUser?.user.groups_detail.map((group) => group.id) ?? [],
  });
  const navigate = useNavigate();
  const menuitems: MenuSideProps[] = useMemo(
    () =>
      //   [
      //   {
      //     icon: <IoBarChartOutline />,
      //     label: "Dashboard",
      //     urls: ["/app"],
      //     onPress: () => navigate("/app"),
      //   },
      //   {
      //     icon: <IoBusiness />,
      //     label: "Empresas",
      //     urls: ["/app/companies"],
      //     onPress: () => navigate("/app/companies"),
      //   },
      //   {
      //     icon: <MdOutlineBusinessCenter />,
      //     label: "Arls",
      //     urls: ["/app/arls"],
      //     onPress: () => navigate("/app/arls"),
      //   },
      //   {
      //     icon: <FaLayerGroup />,
      //     label: "Grupos Empresariales",
      //     urls: ["/app/corporate_group"],
      //     onPress: () => navigate("/app/corporate_group"),
      //   },
      //   {
      //     icon: <FaUserFriends />,
      //     label: "Gestión de usuarios",
      //     urls: ["/app/users"],
      //     onPress: () => navigate("/app/users"),
      //   },
      // ],
      menuData?.map((menu) => ({
        label: menu.label,
        icon: menu.icon,
        path: menu.path,
      })) ?? [],
    [menuData]
  );

  const handleLogout = async () => {
    await logout({
      refresh: authUser?.tokens.refresh ?? "",
    }).unwrap();
    dispatch(clearAuthUser());
    navigate("/login");
  };

  return (
    <aside
      className={clsx("flex flex-col justify-between h-full transition-all", {
        "w-full md:w-56 lg:w-52 ": isCollapsed,
        "w-0 md:w-20": !isCollapsed,
      })}
    >
      <div className="flex flex-col overflow-y-auto">
        <div className="w-full flex justify-between px-4 lg:px-0 lg:justify-center items-center h-20 border-b">
          <img
            src={isCollapsed ? LogoXl : LogoXs}
            alt="Logo"
            className={clsx("pointer-events-none", {
              "w-36": isCollapsed,
              "w-10": !isCollapsed,
            })}
            loading="lazy"
            sizes={isCollapsed ? "(max-width: 600px) 50vw, 100vw" : "10vw"}
          />
          <CiMenuBurger
            className="block md:hidden font-light text-2xl cursor-pointer"
            onClick={() => dispatch(setCollapsed())}
          />
        </div>
        <ul
          className={clsx("my-4 flex flex-col p-4 gap-y-4 overflow-x-auto", {
            "items-start": isCollapsed,
            "items-center": !isCollapsed,
          })}
        >
          {menuLoading && <Skeleton className="w-4 h-4" />}
          {!menuLoading && menufetching ? (
            <Skeleton.Node className="w-full h-12" active children={<></>} />
          ) : (
            <>
              {menuitems.map((items, i) => (
                <MenuSide
                  key={i}
                  icon={items.icon}
                  label={items.label}
                  path={items.path}
                />
              ))}
            </>
          )}
        </ul>
      </div>
      <div className="w-full my-4 flex justify-center items-center">
        <Button
          id="logout"
          size={"large"}
          icon={<PiSignOutThin />}
          aria-label="Cerrar Sesion"
          aria-labelledby="logout"
          onClick={handleLogout}
          loading={isLoading}
        >
          {isCollapsed ? "Cerrar Sesión" : ""}
        </Button>
      </div>
    </aside>
  );
}
