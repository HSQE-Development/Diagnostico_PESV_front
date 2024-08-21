import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
interface AppLayoutProps {
  children?: React.ReactNode;
}
// bg-gradient-to-r from-blue-50 to-cyan-50
export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <div className="w-screen h-screen flex flex-1 bg-white ">
        <Sidebar />
        <main className="relative h-full flex-1 flex flex-col w-full overflow-auto border-l">
          <Navbar />
          <div className="bg-white w-full flex-1 p-2">
            <Outlet /> {/* Esto renderiza las rutas hijas */}
          </div>
        </main>
      </div>
    </>
  );
}
