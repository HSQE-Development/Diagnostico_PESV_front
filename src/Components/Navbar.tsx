import React, { lazy, Suspense } from "react";
import { CiMenuBurger, CiMenuFries } from "react-icons/ci";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setCollapsed } from "@/stores/features/sideBarSlice";
import MiniProfilePreload from "./Preloads/MiniProfilePreload";
import LogoXl from "../assets/Logo_xl.png";

const MiniProfile = lazy(() => import("./MiniProfile"));
type NavbarProps = {
  isExternal?: boolean;
};

export default function Navbar({ isExternal }: NavbarProps) {
  const authUser = useAppSelector((state) => state.auth.authUser);
  const dispatch = useAppDispatch();
  const isCollapsed = useAppSelector((state) => state.sidebarState.isCollapsed);

  return (
    <header
      className={`w-full z-20  min-h-20 bg-white transition-all border-b flex ${
        isExternal
          ? "justify-center border-b-4 border-black"
          : "justify-between"
      } items-center px-8`}
    >
      <nav
        className={`flex ${
          isExternal ? "justify-center items-center gap-4" : "justify-between"
        } items-center w-full`}
      >
        {isExternal && (
          <img src={LogoXl} className="w-32" alt="Logo" loading="lazy" />
        )}
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
          Diagnostico PESV
          {isExternal && (
            <small className="text-zinc-500 text-sm align-text-bottom">
              para empresas
            </small>
          )}
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
