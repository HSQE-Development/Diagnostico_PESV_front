import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { CorporateProvider } from "@/context/CorporateGroupContext";
import { authService } from "@/stores/services/authService";
import { useAppDispatch } from "@/stores/hooks";
import { setAuthUser } from "@/stores/features/authSlice";

export default function ExternalLayout() {
  const [loginMutation] = authService.useLoginMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleLogin = async () => {
      try {
        const userLogged = await loginMutation({
          email: "consultasExternas@gmail.com",
          password: "w829-L|bjJ2",
        }).unwrap();
        dispatch(setAuthUser(userLogged));
        localStorage.setItem("accesToken", userLogged.tokens.access);
      } catch (error: any) {
        console.log("ERROR", error);
      }
    };

    handleLogin();
  }, [dispatch]);
  return (
    <CorporateProvider>
      <div className="w-screen h-screen flex flex-1  bg-white transition-all">
        <main className="relative h-full flex-1 flex flex-col w-full overflow-auto border-l">
          <section className="bg-transparent w-full flex-1 p-2">
            <Outlet />
          </section>
        </main>
      </div>
    </CorporateProvider>
  );
}
