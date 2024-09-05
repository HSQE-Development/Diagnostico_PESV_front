import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { CorporateProvider } from "@/context/CorporateGroupContext";

export default function ExternalLayout() {
  return (
    <CorporateProvider>
      <div className="w-screen h-screen flex flex-1 bg-zinc-100">
        <div className="flex flex-col w-full h-full items-center justify-start">
          <Navbar isExternal />
          <main className="w-full h-full flex flex-col items-center justify-start p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </CorporateProvider>
  );
}
