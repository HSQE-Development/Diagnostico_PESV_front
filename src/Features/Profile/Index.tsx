import { authService } from "@/stores/services/authService";
import InfoProfile from "./Components/InfoProfile";
import { lazy, Suspense, useEffect } from "react";
import { useAppDispatch } from "@/stores/hooks";
import { updateUser } from "@/stores/features/authSlice";
import { FaChartPie } from "react-icons/fa";
import { Skeleton } from "antd";
import ModeEjecutionChar from "./Components/ModeEjecutionChar";
const CountBarChar = lazy(() => import("./Components/CountBarChar"));
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
      <div className="grid gap-4 grid-cols-6 h-full md:grid-rows-2 p-4 relative ">
        <div className="row-span-2 col-span-6 md:col-span-2 bg-gradient-to-r from-zinc-100 to-sky-50 rounded-xl overflow-y-auto h-full">
          <InfoProfile isLoading={isLoading} />
        </div>
        <div className="row-span-1 col-span-6 md:col-span-4 lg:col-span-2 bg-white border rounded-xl flex-1 ">
          <div className="w-full flex items-center justify-start gap-4 bg-blue-100 p-4 rounded-tr-md rounded-tl-md">
            <FaChartPie />
            <p className="font-semibold">
              Diagnosticos realizados por NIVEL PESV
            </p>
          </div>
          <Suspense
            fallback={
              <>
                <div className="w-full flex items-center justify-center">
                  <Skeleton.Avatar
                    active={isLoading}
                    size={200}
                    shape={"circle"}
                  />
                </div>
              </>
            }
          >
            <CountBarChar />
          </Suspense>
        </div>
        <div className="row-span-1 col-span-6 md:col-span-4 lg:col-span-2 bg-white border rounded-xl flex-1">
          <div className="w-full flex items-center justify-start gap-4 bg-blue-100 p-4 rounded-tr-md rounded-tl-md">
            <FaChartPie />
            <p className="font-semibold">
              Diagnosticos realizados por modo de ejecución
            </p>
          </div>
          <ModeEjecutionChar />
        </div>
      </div>
    </>
  );
}
