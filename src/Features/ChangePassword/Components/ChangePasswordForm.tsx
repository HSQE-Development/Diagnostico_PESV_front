import { updateUser } from "@/stores/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { userService } from "@/stores/services/userService";
import { TOAST_TYPE, toastHandler } from "@/utils/useToast";
import { Button, Input } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/[0-9]/, "La contraseña debe incluir al menos un número")
    .matches(
      /[!@#\$%\^&\*]/,
      "La contraseña debe incluir al menos un carácter especial (@, *, _, !, etc.)"
    )
    .required("La contraseña es obligatoria"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), undefined], "Las contraseñas no coinciden")
    .required("Confirmar contraseña es obligatorio"),
});
interface FormValues {
  newPassword: string;
  confirmPassword: string;
}
export default function ChangePasswordForm() {
  const initialValues: FormValues = {
    newPassword: "",
    confirmPassword: "",
  };
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [changePassword] = userService.useChangePasswordMutation();
  const authUser = useAppSelector((state) => state.auth.authUser);
  return (
    <div className="flex-1 bg-white rounded-lg p-8 h-full md:h-auto flex flex-col items-center justify-center">
      <h3 className="font-bold text-5xl">Cambiar Contraseña</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values: FormValues) => {
          try {
            const updatedUser = await changePassword({
              user: authUser?.user.id ?? 0,
              password: values.newPassword,
            }).unwrap();
            dispatch(updateUser(updatedUser));
            toastHandler(TOAST_TYPE.SUCCESS_TOAST, "Cambio exitoso");
            navigate("/app");
          } catch (error: any) {
            toastHandler(
              TOAST_TYPE.ERROR_TOAST,
              "Error interno del sistema, comuniquese con un administrador"
            );
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="w-full my-6">
            <small>
              La contraseña debe tener al menos 8 caracteres, debe incluir
              números y al menos un carácter especial: @ * _ !, etc.
            </small>
            <div className="my-4 flex flex-col gap-y-2">
              <div>
                <label>Nueva contraseña</label>
                <Field name="newPassword">
                  {({ field }: { field: any }) => (
                    <Input.Password size="large" {...field} />
                  )}
                </Field>
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red-600"
                />
              </div>

              <div>
                <label>Confirmar contraseña</label>
                <Field name="confirmPassword">
                  {({ field }: { field: any }) => (
                    <Input.Password size="large" {...field} />
                  )}
                </Field>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-600"
                />
              </div>
            </div>

            <Button
              type="primary"
              icon={<BsArrowRight />}
              className="w-full bg-black hover:bg-zinc-800 active:bg-zinc-700 p-6"
              htmlType="submit"
              loading={isSubmitting}
            >
              Guardar
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
