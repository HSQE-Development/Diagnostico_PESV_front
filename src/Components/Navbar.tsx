import React, { lazy, Suspense, useEffect } from "react";
import { CiMenuBurger, CiMenuFries } from "react-icons/ci";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setCollapsed } from "@/stores/features/sideBarSlice";
import MiniProfilePreload from "./Preloads/MiniProfilePreload";
import { useCorporate } from "@/context/CorporateGroupContext";

const MiniProfile = lazy(() => import("./MiniProfile"));
type NavbarProps = {
  isExternal?: boolean;
};

export default function Navbar({ isExternal }: NavbarProps) {
  const authUser = useAppSelector((state) => state.auth.authUser);
  const dispatch = useAppDispatch();
  const isCollapsed = useAppSelector((state) => state.sidebarState.isCollapsed);

  const { setIsExternal } = useCorporate();

  useEffect(() => {
    if (authUser) {
      const userRoles = authUser.user.groups_detail.map((role) => role.name);
      //(userRoles);
      if (userRoles.includes("Empresa Externa")) {
        setIsExternal(true);
      } else {
        setIsExternal(false);
      }
    }
  }, [authUser]);

  return (
    <header
      className={`w-full z-20  min-h-20 bg-white transition-all border-b flex ${"justify-between"} items-center px-8`}
    >
      <nav
        className={`flex ${
          isExternal ? "justify-center" : "justify-between"
        } items-center w-full`}
      >
        {!isExternal && (
          <>
            {isCollapsed ? (
              <CiMenuBurger
                className="font-extrabold text-2xl cursor-pointer"
                onClick={() => dispatch(setCollapsed())}
              />
            ) : (
              <CiMenuFries
                className="font-extrabold text-2xl cursor-pointer"
                onClick={() => dispatch(setCollapsed())}
              />
            )}
          </>
        )}
        <h2 className="hidden md:block text-xl font-semibold">
          {isExternal ? "Caracterización de empresas" : "Diagnostico PESV"}
        </h2>
        {!isExternal && (
          <Suspense fallback={<MiniProfilePreload />}>
            <MiniProfile
              username={`${
                authUser?.user.first_name ? authUser?.user.first_name : ""
              } ${authUser?.user.first_name ? authUser?.user.last_name : ""}`}
              cargo={authUser?.user.groups_detail ?? []}
              avatar={authUser?.user.avatar ?? undefined}
            />
          </Suspense>
        )}
      </nav>
    </header>
  );
}
