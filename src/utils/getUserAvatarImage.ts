import DefaultProfile from "@/assets/defaultProfile.png";
import { ColorPalette } from "@/interfaces/Comun";
import { IUser } from "@/interfaces/IUser";

enum Role {
  SUPER_ADMIN = "SuperAdmin",
  ADMIN = "Admin",
  CONSULTOR = "Consultor",
  ANALISTA = "Analista",
}

export const getUservatarUrl = (avatarbackend: string | undefined): string => {
  const baseURL = import.meta.env.VITE_BACKEND_URL;
  const avatarURL = avatarbackend
    ? `${baseURL}${avatarbackend}`
    : DefaultProfile;
  return avatarURL;
};

export function getFullName(user?: IUser | null): string {
  return user ? `${user.first_name} ${user.last_name}` : "";
}

export function getColorByRole(role: string): ColorPalette {
  const roleValue = Role[role.toUpperCase() as keyof typeof Role] || role;

  switch (roleValue) {
    case Role.SUPER_ADMIN:
      return { tailwind: "bg-yellow-500", hex: "#F6E05E" };
    case Role.ADMIN:
      return { tailwind: "bg-blue-500", hex: "#4299E1" };
    case Role.CONSULTOR:
      return { tailwind: "bg-green-500", hex: "#48BB78" };
    case Role.ANALISTA:
      return { tailwind: "bg-cyan-600", hex: "#0891b2" };
    default:
      return { tailwind: "bg-gray-500", hex: "#718096" };
  }
}
