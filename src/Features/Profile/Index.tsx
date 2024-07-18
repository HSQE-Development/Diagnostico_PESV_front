import { authService } from "@/stores/services/authService";
import InfoProfile from "./Components/InfoProfile";
import { useEffect } from "react";
import { useAppDispatch } from "@/stores/hooks";
import { updateUser } from "@/stores/features/authSlice";

export default function ProfilePage() {
  const {
    data: fetchProfile,
    isLoading,
    refetch,
  } = authService.useMyProfileQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (fetchProfile) {
      dispatch(updateUser(fetchProfile));
    }
  }, [fetchProfile]);
  return (
    <>
      <div className="grid gap-4 grid-cols-6 h-full md:grid-rows-2 p-4">
        <div className="relative row-span-2 col-span-6 md:col-span-2 bg-gradient-to-r from-zinc-100 to-sky-50 rounded-xl">
          <InfoProfile isLoading={isLoading} />
        </div>
        <div className="row-span-1 col-span-6 md:col-span-4  bg-gradient-to-r from-zinc-100 to-sky-50 rounded-xl">
          In progress
        </div>
        <div className="col-span-6 md:col-span-2 bg-gradient-to-r from-zinc-100 to-sky-50 rounded-xl"></div>
        <div className="col-span-6 md:col-span-2 bg-gradient-to-r from-zinc-100 to-sky-50 rounded-xl"></div>
      </div>
    </>
  );
}
