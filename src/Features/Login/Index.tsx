import LoginForm from "./Components/LoginForm";
import LoginImg from "./assets/LoginBack.svg";

export default function LoginPage() {
  return (
    <>
      <div className="w-screen h-screen flex-1 flex justify-center items-center bg-gradient-to-r from-cyan-50 to-sky-200 transition-all">
        <div className="flex flex-col md:flex-row flex-1 w-full h-full justify-evenly items-center transition-all">
          <div className=" hidden md:w-2/4 md:flex">
            <img src={LoginImg} alt="" />
          </div>
          <div className="w-full h-full md:w-auto md:h-auto">
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}
