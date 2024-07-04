import { Button, Input } from "antd";
import { BiUser } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { GoEye } from "react-icons/go";
import { GrSecure } from "react-icons/gr";
import { IoEyeOff } from "react-icons/io5";

export default function LoginForm() {
  return (
    <div className="flex-1 bg-white rounded-lg p-8 h-full md:h-auto flex flex-col items-center justify-center">
        <h3 className="font-bold text-5xl">Iniciar Sesión</h3>
        <form className="w-full my-6">
            <div className="my-4 flex flex-col gap-y-4">
                <Input size="large" placeholder="Email" prefix={<BiUser />} className="p-4"/>
                <Input.Password size="large" placeholder="Contraseña" prefix={<GrSecure />} className="p-4"
                    iconRender={(visible) => (visible ? <GoEye/> : <IoEyeOff  />)}
                />
            </div>

            <Button
                type="primary"
                icon={<BsArrowRight />}
                className="w-full bg-black p-6"
            >
                Ingresar
            </Button>

        </form>
    </div>
  )
}
