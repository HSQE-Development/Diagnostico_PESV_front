import React from "react";
import LoginImg from "./assets/change_pass_img.png";
import ChangePasswordForm from "./Components/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <div className="w-screen h-screen flex-1 flex justify-center items-center bg-gradient-to-r from-cyan-50 to-sky-200 transition-all">
      <div className="flex flex-col md:flex-row flex-1 w-full h-full justify-evenly items-center transition-all">
        <div className="hidden md:w-1/3 md:flex">
          <img src={LoginImg} alt="" />
        </div>
        <div className="w-full h-full md:w-1/3 md:h-auto">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
