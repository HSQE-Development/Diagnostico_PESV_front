import DefaultProfile from "@/assets/defaultProfile.png";

export const getUservatarUrl = (avatarbackend: string | undefined): string => {
  const baseURL = import.meta.env.VITE_BACKEND_URL;
  const avatarURL = avatarbackend
    ? `${baseURL}${avatarbackend}`
    : DefaultProfile;
  return avatarURL;
};
