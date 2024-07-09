import { useAppSelector } from "@/stores/hooks";
import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface MenuSideProps{
  icon: React.ReactElement
  label: string
  onPress?: () => void
  url?: string
}

export default function MenuSide({icon, label, onPress, url}: MenuSideProps) {
  const sideBarState = useAppSelector((state) => state.sidebarState);
  const [active, setActive] = useState<boolean>(false)
  const location = useLocation();

  useEffect(() => {
    if(location.pathname === url){
      setActive(true)
    }else{
      setActive(false)
    }
  }, [url, onPress])
  return (
    <Tooltip placement="right" title={label}>
      <li className={`${active ? "bg-black text-white" : ""} cursor-pointer hover:bg-black active:bg-slate-700 hover:text-white ${!sideBarState.isCollapsed ? "p-2 justify-center w-[90%]" : "justify-start w-full"} list-none rounded-md px-2 flex items-center shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] transition-all`}
        onClick={onPress}
      >
        {icon}
        {sideBarState.isCollapsed && (
          <div className="p-2">
            <h3 className="font-bold">{label}</h3>
          </div>
        )}
      </li>

    </Tooltip>
  );
}
