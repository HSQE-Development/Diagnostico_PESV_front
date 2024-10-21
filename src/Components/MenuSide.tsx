import { useAppSelector } from "@/stores/hooks";
import { Tooltip } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { iconByMenu, MenuType } from "@/utils/icon-by-menu.utility";
export interface MenuSideProps {
  label: string;
  icon: string;
  path: string;
}

function MenuSide({ icon, label, path }: MenuSideProps) {
  const sideBarState = useAppSelector((state) => state.sidebarState);
  const [active, setActive] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const isActive = path == location.pathname;
    setActive(isActive);
  }, [path, location.pathname]);

  const menuIcon = useMemo(() => {
    return iconByMenu(icon as MenuType);
  }, [icon]);
  return (
    <Tooltip placement="right" title={label}>
      <Link
        to={path}
        className={clsx(
          "cursor-pointer hover:bg-white active:bg-slate-200 hover:text-[#4D4E55] list-none rounded-md px-3 flex items-center transition-all",
          {
            "bg-black text-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]":
              active,
            "text-[#9899A2]": !active,
            "p-2 justify-center w-[90%]": !sideBarState.isCollapsed,
            "justify-start w-full": sideBarState.isCollapsed,
          }
        )}
      >
        {menuIcon}
        {sideBarState.isCollapsed && (
          <div className="p-2">
            <h3 className="font-normal tex-sm ml-1">{label}</h3>
          </div>
        )}
      </Link>
    </Tooltip>
  );
}

export default React.memo(MenuSide);
