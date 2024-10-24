import FloatLabel from "@/Components/FloatLabel";
import useArl from "@/hooks/arlHooks";
import { ArlDTO } from "@/interfaces/Arl";
import { arlService } from "@/stores/services/arlService";
import { TOAST_TYPE, toastHandler } from "@/utils/useToast";
import { skipToken } from "@reduxjs/toolkit/query";
import { Button, Input } from "antd";
import { Formik } from "formik";
import React, { useEffect } from "react";
import { CiSaveDown1 } from "react-icons/ci";
import { MdEdit } from "react-icons/md";
import * as Yup from "yup";

const initialValues: ArlDTO = {
  name: "",
};

interface ArlFormProps {
  id?: number;
}

export default function ArlForm({ id }: ArlFormProps) {
  const { changeArl, createArl, isSaving, isUpdating } = useArl();
  const { data: fetchArl } = arlService.useFindByIdQuery(
    id ? { id } : skipToken
  );
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Campo Obligatorio"),
  });

  const handleSubmit = async (values: ArlDTO) => {
    try {
      if (id) {
        //Aqui se edita
        await changeArl(id, values);
      } else {
        // Aqui se registra
        await createArl(values);
      }
    } catch (error: any) {
      //("ERROR", error);
      toastHandler(TOAST_TYPE.ERROR_TOAST, error.data.error);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, actions) => {
        await handleSubmit(values);
        actions.setSubmitting(false);
      }}
      enableReinitialize
    >
      {(props) => {
        useEffect(() => {
          if (fetchArl) {
            props.setValues({
              name: fetchArl.name,
            });
          }
          // setDedicationId(fetchArl?.dedication_detail.id);
        }, [fetchArl, id]);
        return (
          <form
            onSubmit={props.handleSubmit}
            className="flex flex-col justify-evenly relative"
          >
            <div className="grid grid-cols-12 gap-4 gap-y-8 mt-4">
              <div className="col-span-12">
                <FloatLabel label="Nombre de la arl" obligatory>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={props.values.name}
                    onChange={props.handleChange}
                  />
                </FloatLabel>
              </div>
            </div>
            <div className="col-span-12 flex items-center justify-center mt-4">
              <Button
                htmlType="submit"
                icon={id ? <MdEdit /> : <CiSaveDown1 />}
                size="large"
                className={`${
                  id
                    ? "bg-orange-400 border-2 border-orange-400"
                    : "bg-green-500 border-2 border-green-400"
                } text-white`}
                loading={isSaving || isUpdating}
              >
                {id ? "Editar" : "Guardar"}
              </Button>
            </div>
          </form>
        );
      }}
    </Formik>
  );
}
