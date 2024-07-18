import { setAuthUser } from "@/stores/features/authSlice";
import { useAppDispatch } from "@/stores/hooks";
import { authService } from "@/stores/services/authService";
import { TOAST_TYPE, toastHandler } from "@/utils/useToast";
import { Button, Input } from "antd";
import { ChangeEvent, useState } from "react";
import { BiUser } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { GoEye } from "react-icons/go";
import { GrSecure } from "react-icons/gr";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "" as string,
    password: "" as string,
  });
  const dispatch = useAppDispatch();
  const [loginMutation, { isLoading }] = authService.useLoginMutation();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userLogged = await loginMutation({
        email: loginData.email,
        password: loginData.password,
      }).unwrap();
      dispatch(setAuthUser(userLogged));
      localStorage.setItem("accesToken", userLogged.tokens.access);
      toastHandler(TOAST_TYPE.SUCCESS_TOAST, "Ingreso Correcto");
      navigate("/app");
    } catch (error: any) {
      console.log("ERROR", error);
      if (error.status === 400) {
        toastHandler(TOAST_TYPE.ERROR_TOAST, error.data.error);
      } else if (error.status === 500) {
        toastHandler(
          TOAST_TYPE.ERROR_TOAST,
          "Error interno del sistema, comuniquese con un administrador"
        );
      } else {
        toastHandler(
          TOAST_TYPE.ERROR_TOAST,
          "Error interno del sistema, comuniquese con un administrador"
        );
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex-1 bg-white rounded-lg p-8 h-full md:h-auto flex flex-col items-center justify-center">
      <h3 className="font-bold text-5xl">Iniciar Sesión</h3>
      <form className="w-full my-6" onSubmit={handleLogin}>
        <div className="my-4 flex flex-col gap-y-4">
          <Input
            size="large"
            placeholder="Email"
            prefix={<BiUser />}
            className="p-4"
            name="email"
            value={loginData.email}
            onChange={handleChange}
          />
          <Input.Password
            size="large"
            placeholder="Contraseña"
            prefix={<GrSecure />}
            className="p-4"
            iconRender={(visible) => (visible ? <GoEye /> : <IoEyeOff />)}
            name="password"
            value={loginData.password}
            onChange={handleChange}
          />
        </div>

        <Button
          type="primary"
          icon={<BsArrowRight />}
          className="w-full bg-black p-6"
          loading={isLoading}
          htmlType="submit"
        >
          Ingresar
        </Button>
      </form>
    </div>
  );
}
