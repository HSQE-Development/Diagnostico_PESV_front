import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import clsx from "clsx";
import { useMediaQuery } from "@/hooks/utilsHooks";
import { setCollapsed } from "@/stores/features/sideBarSlice";
export interface MenuSideProps {
  icon: React.ReactElement;
  label: string;
  onPress?: () => void;
  urls?: string[];
}

function MenuSide({ icon, label, onPress, urls }: MenuSideProps) {
  const dispatch = useAppDispatch();

  const sideBarState = useAppSelector((state) => state.sidebarState);
  const [active, setActive] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    if (urls && urls.length > 0) {
      // Verificar si la URL actual está incluida en el array de URLs
      const isActive = urls.some((url) => location.pathname === url);
      setActive(isActive);
    }
  }, [urls, location.pathname]);
  const isMdOrLess = useMediaQuery("(max-width: 768px)");
  return (
    <Tooltip placement="right" title={label}>
      <li
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
        onClick={() => {
          onPress?.();
          if (isMdOrLess) {
            dispatch(setCollapsed());
          }
        }}
      >
        {icon}
        {sideBarState.isCollapsed && (
          <div className="p-2">
            <h3 className="font-normal tex-sm ml-1">{label}</h3>
          </div>
        )}
      </li>
    </Tooltip>
  );
}

export default React.memo(MenuSide);
