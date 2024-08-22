import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
// bg-gradient-to-r from-blue-50 to-cyan-50
export default function AppLayout() {
  return (
    <>
      <div className="w-screen h-screen flex flex-1 bg-white ">
        <Sidebar />
        <main className="relative h-full flex-1 flex flex-col w-full overflow-auto border-l">
          <Navbar />
          <section className="bg-white w-full flex-1 p-2">
            <Outlet /> {/* Esto renderiza las rutas hijas */}
          </section>
        </main>
      </div>
    </>
  );
}
