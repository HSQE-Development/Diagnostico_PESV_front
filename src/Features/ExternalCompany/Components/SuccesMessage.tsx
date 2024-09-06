import React, { useEffect } from "react";
import DoneImg from "../assets/Done.png";
import { useAppDispatch } from "@/stores/hooks";
import { setExternalCurrent } from "@/stores/features/utilsSlice";

export default function SuccesMessage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Aquí pones el código que se ejecuta cuando se recarga la página o se monta el componente

    // Si quieres que el código se ejecute al desmontar el componente, puedes retornar una función de limpieza
    return () => {
      dispatch(setExternalCurrent(0));
    };
  }, []);
  return (
    <div className="w-full flex items-center justify-center">
      <img src={DoneImg} alt="Logo" className={"w-96"} loading="lazy" />
      <div className="flex flex-col w-[25%]">
        <h3 className="font-bold text-5xl">Exitoso!</h3>
        <p>
          La informaciòn sera verificada y validada para el diagnostico del PESV
        </p>
      </div>
    </div>
  );
}
