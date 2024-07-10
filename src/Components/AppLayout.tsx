import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <div className="w-screen h-screen flex flex-1 bg-gradient-to-r from-blue-50 to-cyan-50">
        <Sidebar />
        <main className="relative h-full flex-1 flex flex-col items-center mb-4 overflow-auto">
          <Navbar />
          <div className="bg-white w-[95%] flex-1 p-2 rounded-md shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
