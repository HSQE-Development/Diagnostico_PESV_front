import React from "react";
import { CiMenuBurger, CiMenuFries } from "react-icons/ci";
import MiniProfile from "./MiniProfile";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setCollapsed } from "@/stores/features/sideBarSlice";

export default function Navbar() {
  const authUser = useAppSelector((state) => state.auth.authUser);
  const dispatch = useAppDispatch();
  const isCollapsed = useAppSelector((state) => state.sidebarState.isCollapsed);

  return (
    <div className="w-full z-20  min-h-20 bg-white transition-all border-b flex justify-between items-center px-8">
      <div className="flex justify-between items-center w-full">
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
        <h2 className="hidden md:flex text-xl font-bold">Diagnostico PESV</h2>
        <MiniProfile
          username={`${
            authUser?.user.first_name ? authUser?.user.first_name : ""
          } ${authUser?.user.first_name ? authUser?.user.last_name : ""}`}
          cargo={authUser?.user.groups_detail ?? []}
          avatar={authUser?.user.avatar ?? undefined}
        />
      </div>
    </div>
  );
}
