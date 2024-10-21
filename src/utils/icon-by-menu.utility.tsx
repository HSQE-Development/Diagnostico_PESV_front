import { FaLayerGroup, FaUserFriends } from "react-icons/fa";
import { IoBarChartOutline, IoBusiness } from "react-icons/io5";
import { MdOutlineBusinessCenter } from "react-icons/md";

export type MenuType =
  | "dashboard"
  | "company"
  | "arl"
  | "corporate_group"
  | "user"
  | "";

export const iconByMenu = (type: MenuType) => {
  switch (type) {
    case "dashboard":
      return <IoBarChartOutline />;
    case "company":
      return <IoBusiness />;
    case "arl":
      return <MdOutlineBusinessCenter />;
    case "corporate_group":
      return <FaLayerGroup />;
    case "user":
      return <FaUserFriends />;
    default:
      return null; // En caso de un tipo no válido
  }
};
