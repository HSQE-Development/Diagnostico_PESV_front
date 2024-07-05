import { useAppSelector } from "@/stores/hooks";
import { FaChartArea } from "react-icons/fa";

export default function MenuSide() {
  const sideBarState = useAppSelector((state) => state.sidebarState);

  return (
    <li className={`${!sideBarState.isCollapsed ? "p-2 justify-center  w-[90%]" : "justify-start w-full"} list-none rounded-md px-2 flex items-center shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] transition-all`}>
      <FaChartArea/>
      {sideBarState.isCollapsed && (
        <div className="p-2">
          <h3 className="font-bold">Dashboard</h3>
        </div>
      )}
    </li>
  );
}
