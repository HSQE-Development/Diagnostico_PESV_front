import FloatLabel from "@/Components/FloatLabel";
import { Company, CompanyDTO } from "@/interfaces/Company";
import { setCompany, setUpdateCompany } from "@/stores/features/companySlice";
import { setSegments } from "@/stores/features/segmentSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { companyService } from "@/stores/services/companyService";
import { segmentService } from "@/stores/services/segmentServices";
import { TOAST_TYPE, toastHandler } from "@/utils/useToast";
import { skipToken } from "@reduxjs/toolkit/query";
import { Button, Input, Select } from "antd";
import { Formik, useFormik } from "formik";
import React, { ChangeEvent, useEffect, useState } from "react";
import { CiSaveDown1 } from "react-icons/ci";
import { MdEdit } from "react-icons/md";
import { useToast } from "react-toastify";
import * as Yup from "yup";

interface CompanyFormProps {
  id?: number;
}

const initialValues: CompanyDTO = {
  name: "",
  email: "",
  size: 0,
  nit: "",
  diagnosis: "",
  dependant: "",
  dependant_phone: "",
  activities_ciiu: "",
  acquired_certification: "",
  segment: 0,
};

export default function CompanyForm({ id }: CompanyFormProps) {
  const { data: fetchSegments, isLoading } = segmentService.useFindAllQuery();
  const { data: fetchCompany } = companyService.useFindByIdQuery(
    id ? { id } : skipToken
  );
  const dispatch = useAppDispatch();
  const segments = useAppSelector((state) => state.segment.segments);
  const [filteredSegments, setFilteredSegments] = useState(segments || []);
  useEffect(() => {
    if (fetchSegments) {
      dispatch(setSegments(fetchSegments));
      setFilteredSegments(fetchSegments);
    }
  }, [fetchSegments]);

  const [save, { isLoading: saveLoad }] = companyService.useSaveMutation();
  const [updateCompany] = companyService.useUpdateCompanyMutation();

  const onSearch = (value: string) => {
    const filtered = segments?.filter((segment) =>
      segment.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSegments(filtered || []);
  };

  const segmentOptions = filteredSegments.map((segment) => ({
    value: segment.id,
    label: segment.name,
  }));

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Campo Obligatorio"),
    email: Yup.string()
      .email("Correo electronico invalido")
      .required("Campo Obligatorio"),
    size: Yup.number().required("Campo Obligatorio"),
    nit: Yup.string().required("Campo Obligatorio"),
    diagnosis: Yup.string().required("Campo Obligatorio"),
    dependant: Yup.string().required("Campo Obligatorio"),
    dependant_phone: Yup.string().required("Campo Obligatorio"),
    activities_ciiu: Yup.string().required("Campo Obligatorio"),
    acquired_certification: Yup.string().required("Campo Obligatorio"),
    segment: Yup.number().required("Campo Obligatorio"),
  });

  const changeCompany = async (values: CompanyDTO) => {
    const updatedCompany = await updateCompany({
      id, //Id de la maquina que se quiere editar
      name: values.name,
      email: values.email,
      acquired_certification: values.acquired_certification,
      activities_ciiu: values.activities_ciiu,
      nit: values.nit,
      size: values.size,
      diagnosis: values.diagnosis,
      dependant: values.dependant,
      dependant_phone: values.dependant_phone,
      segment: values.segment,
    }).unwrap();
    toastHandler(TOAST_TYPE.SUCCESS_TOAST, "Actualizado Correctamente");
    dispatch(setUpdateCompany(updatedCompany));
  };

  const createCompany = async (values: CompanyDTO) => {
    const savedCompany = await save(values).unwrap(); //Metodo que guarda
    toastHandler(TOAST_TYPE.SUCCESS_TOAST, "Registrado Correctamente");
    dispatch(setCompany(savedCompany));
  };

  const handleSubmit = async (values: CompanyDTO) => {
    try {
      if (id) {
        //Aqui se edita
        await changeCompany(values);
      } else {
        // Aqui se registra
        await createCompany(values);
      }
    } catch (error: any) {
      console.log("ERROR", error);
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
          if (fetchCompany) {
            props.setValues({
              name: fetchCompany.name,
              email: fetchCompany.email ?? "",
              acquired_certification: fetchCompany.acquired_certification,
              activities_ciiu: fetchCompany.activities_ciiu,
              nit: fetchCompany.nit,
              size: fetchCompany.size,
              diagnosis: fetchCompany.diagnosis,
              dependant: fetchCompany.dependant,
              dependant_phone: fetchCompany.dependant_phone,
              segment: fetchCompany.segment_detail.id || 0,
            });
          }
        }, [fetchCompany, id]);
        return (
          <form
            onSubmit={props.handleSubmit}
            className="flex flex-col justify-evenly relative"
          >
            <div className="grid grid-cols-12 gap-4 gap-y-8 mt-4">
              <div className="col-span-12 md:col-span-6">
                <FloatLabel label="Nombre de la empresa">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={props.values.name}
                    onChange={props.handleChange}
                  />
                </FloatLabel>
              </div>
              <div className="col-span-12 md:col-span-6">
                <FloatLabel label="NIT de la empresa">
                  <Input
                    id="nit"
                    name="nit"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.nit}
                  />
                </FloatLabel>
                {props.touched.nit && props.errors.nit ? (
                  <div className="text-red-600">{props.errors.nit}</div>
                ) : null}
              </div>
              <div className="col-span-12 md:col-span-6">
                <FloatLabel label="Correo Electrónico">
                  <Input
                    id="email"
                    name="email"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.email}
                  />
                </FloatLabel>
                {props.touched.email && props.errors.email ? (
                  <div className="text-red-600">{props.errors.email}</div>
                ) : null}
              </div>
              <div className="col-span-12 md:col-span-6">
                <FloatLabel label="Actividad CIIU">
                  <Input
                    id="activities_ciiu"
                    name="activities_ciiu"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.activities_ciiu ?? ""}
                  />
                </FloatLabel>
                {props.touched.activities_ciiu &&
                props.errors.activities_ciiu ? (
                  <div className="text-red-600">
                    {props.errors.activities_ciiu}
                  </div>
                ) : null}
              </div>
              <div className="col-span-12 md:col-span-3">
                <FloatLabel label="Tamaño Empresa">
                  <Input
                    id="size"
                    name="size"
                    value={props.values.size}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  />
                </FloatLabel>
                {props.touched.size && props.errors.size ? (
                  <div className="text-red-600">{props.errors.size}</div>
                ) : null}
              </div>
              <div className="col-span-12 md:col-span-3">
                <FloatLabel label="Segmento al que pertenece">
                  <Select
                    showSearch
                    optionFilterProp="label"
                    onSearch={onSearch}
                    loading={isLoading}
                    options={segmentOptions}
                    className="w-full"
                    onChange={(value) => props.setFieldValue("segment", value)}
                    onBlur={props.handleBlur}
                    value={props.values.segment}
                  />
                </FloatLabel>
                {props.touched.segment && props.errors.segment ? (
                  <div className="text-red-600">{props.errors.segment}</div>
                ) : null}
              </div>
              <div className="col-span-12 md:col-span-3">
                <FloatLabel label="Persona de contacto">
                  <Input
                    id="dependant"
                    name="dependant"
                    value={props.values.dependant ?? ""}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  />
                </FloatLabel>
                {props.touched.dependant && props.errors.dependant ? (
                  <div className="text-red-600">{props.errors.dependant}</div>
                ) : null}
              </div>
              <div className="col-span-12 md:col-span-3">
                <FloatLabel label="Teléfono Persona de contacto">
                  <Input
                    id="dependant_phone"
                    name="dependant_phone"
                    value={props.values.dependant_phone ?? ""}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  />
                </FloatLabel>
                {props.touched.dependant_phone &&
                props.errors.dependant_phone ? (
                  <div className="text-red-600">
                    {props.errors.dependant_phone}
                  </div>
                ) : null}
              </div>
              <div className="col-span-12 md:col-span-6">
                <FloatLabel label="Certificaciones adquiridas">
                  <Input
                    id="acquired_certification"
                    name="acquired_certification"
                    value={props.values.acquired_certification ?? ""}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  />
                </FloatLabel>
                {props.touched.acquired_certification &&
                props.errors.acquired_certification ? (
                  <div className="text-red-600">
                    {props.errors.acquired_certification}
                  </div>
                ) : null}
              </div>
              <div className="col-span-12 md:col-span-6">
                <FloatLabel label="Diagnósticos realizados">
                  <Input
                    id="diagnosis"
                    name="diagnosis"
                    value={props.values.diagnosis ?? ""}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  />
                </FloatLabel>
                {props.touched.diagnosis && props.errors.diagnosis ? (
                  <div className="text-red-600">{props.errors.diagnosis}</div>
                ) : null}
              </div>
            </div>
            <div className="col-span-12 flex items-center justify-center mt-4">
              <Button
                htmlType="submit"
                icon={id ? <MdEdit /> : <CiSaveDown1 />}
                size="large"
                className={`${
                  id ? "bg-orange-400" : "bg-green-500"
                } text-white`}
                loading={saveLoad}
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
