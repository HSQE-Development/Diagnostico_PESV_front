import React from "react";
import { Outlet } from "react-router-dom";
import { CorporateProvider } from "@/context/CorporateGroupContext";

export default function ExternalLayout() {
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
