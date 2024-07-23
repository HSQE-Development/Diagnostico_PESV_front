import FloatLabel from "@/Components/FloatLabel";
import useCompany from "@/hooks/companyHooks";
import { Arl } from "@/interfaces/Arl";
import { CompanyDTO } from "@/interfaces/Company";
import { Mission } from "@/interfaces/Dedication";
import { IUser } from "@/interfaces/IUser";
import { setSegments } from "@/stores/features/segmentSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { arlService } from "@/stores/services/arlService";
import { companyService } from "@/stores/services/companyService";
import { segmentService } from "@/stores/services/segmentServices";
import { userService } from "@/stores/services/userService";
import { TOAST_TYPE, toastHandler } from "@/utils/useToast";
import { formatNIT } from "@/utils/utilsMethods";
import { skipToken } from "@reduxjs/toolkit/query";
import { Button, Input, Select } from "antd";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { CiSaveDown1 } from "react-icons/ci";
import { MdEdit } from "react-icons/md";
import * as Yup from "yup";

interface CompanyFormProps {
  id?: number;
}

const initialValues: CompanyDTO = {
  name: "",
  email: "",
  nit: "",
  diagnosis: "",
  dependant: "",
  dependant_phone: "",
  dependant_position: "",
  activities_ciiu: "",
  acquired_certification: "",
  segment: null,
  consultor: null,
  size: null,
  mission: null,
  arl: null,
};

export default function CompanyForm({ id }: CompanyFormProps) {
  const { changeCompany, createCompany, isSaving, isUpdating } = useCompany();
  const { data: fetchSegments, isLoading } = segmentService.useFindAllQuery();
  const { data: fetchConsultants, isLoading: loadConsultants } =
    userService.useFindAllConsultantsQuery();
  const { data: fetchArl, isLoading: loadArl } = arlService.useFindAllQuery();

  const { data: fetchDedications, isLoading: loadDedications } =
    companyService.useFindAllDedicationsQuery();
  // const [dedicationId, setDedicationId] = useState<number | undefined>();
  // const {
  //   data: fetchCompanySize,
  //   isLoading: loadCompanySize,
  //   refetch,
  //   isUninitialized,
  // } = companyService.useFindcompanySizeByDedicactionIdQuery(
  //   dedicationId ? { id: dedicationId } : skipToken
  // );

  const { data: fetchCompany } = companyService.useFindByIdQuery(
    id ? { id } : skipToken
  );
  const dispatch = useAppDispatch();
  const segments = useAppSelector((state) => state.segment.segments);
  const [filteredSegments, setFilteredSegments] = useState(segments || []);
  const [filteredConsultands, setFilteredConsultands] = useState<IUser[]>([]);
  const [filteredArl, setFilteredArl] = useState<Arl[]>([]);
  const [filteredDedications, setFiltereddedications] = useState<Mission[]>([]);
  // useEffect(() => {
  //   if (!isUninitialized) refetch();
  // }, [dedicationId, isUninitialized]);
  useEffect(() => {
    if (fetchSegments) {
      dispatch(setSegments(fetchSegments));
      setFilteredSegments(fetchSegments);
    }
  }, [fetchSegments]);
  useEffect(() => {
    if (fetchConsultants) {
      setFilteredConsultands(fetchConsultants);
    }
  }, [fetchConsultants]);
  useEffect(() => {
    if (fetchArl) {
      setFilteredArl(fetchArl);
    }
  }, [fetchArl]);
  useEffect(() => {
    if (fetchDedications) {
      setFiltereddedications(fetchDedications);
    }
  }, [fetchDedications]);

  // useEffect(() => {
  //   if (fetchCompanySize) {
  //     setFilteredCompanySize(fetchCompanySize);
  //   }
  // }, [fetchCompanySize]);

  const onSearchArl = (value: string) => {
    const filtered = filteredSegments?.filter((arl) =>
      arl.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSegments(filtered || []);
  };
  const onSearchSegments = (value: string) => {
    const filtered = segments?.filter((segment) =>
      segment.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSegments(filtered || []);
  };
  const onSearchConsultands = (value: string) => {
    const filtered = filteredConsultands?.filter((consultand) => {
      if (consultand.first_name)
        consultand.first_name.toLowerCase().includes(value.toLowerCase());
    });
    setFilteredConsultands(filtered || []);
  };
  const onSearchDedications = (value: string) => {
    const filtered = filteredDedications?.filter((dedication) => {
      if (dedication.name)
        dedication.name.toLowerCase().includes(value.toLowerCase());
    });
    setFiltereddedications(filtered || []);
  };
  // const onSearchCompanySize = (value: string) => {
  //   const filtered = filteredCompanySize?.filter((companySize) => {
  //     if (companySize.name)
  //       companySize.name.toLowerCase().includes(value.toLowerCase());
  //   });
  //   setFilteredCompanySize(filtered || []);
  // };

  const arloptions = filteredArl.map((segment) => ({
    value: segment.id,
    label: segment.name,
  }));
  const segmentOptions = filteredSegments.map((segment) => ({
    value: segment.id,
    label: segment.name,
  }));

  const consultandOptions = filteredConsultands.map((consultand) => ({
    value: consultand.id,
    label: consultand.first_name + " " + consultand.last_name,
  }));

  const dedicationOptions = filteredDedications.map((dedication) => ({
    value: dedication.id,
    label: dedication.name,
  }));
  // const companySizeOptions = filteredCompanySize.map((companySize) => ({
  //   value: companySize.id,
  //   label: companySize.name,
  // }));

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Campo Obligatorio"),
    email: Yup.string().email("Correo electronico invalido"),
    // .required("Campo Obligatorio"),
    nit: Yup.string().required("Campo Obligatorio"),
    // diagnosis: Yup.string().required("Campo Obligatorio"),
    // dependant: Yup.string().required("Campo Obligatorio"),
    // dependant_phone: Yup.string().required("Campo Obligatorio"),
    // activities_ciiu: Yup.string().required("Campo Obligatorio"),
    // acquired_certification: Yup.string().required("Campo ObligatoriformatNIT(e.target.value)o"),
    segment: Yup.number().required("Campo Obligatorio"),
  });

  // const changeCompany = async (values: CompanyDTO) => {
  //   const updatedCompany = await updateCompany({
  //     id, //Id de la maquina que se quiere editar
  //     name: values.name,
  //     email: values.email,
  //     acquired_certification: values.acquired_certification,
  //     activities_ciiu: values.activities_ciiu,
  //     nit: removeHyphen(values.nit, "-"),
  //     diagnosis: values.diagnosis,
  //     dependant: values.dependant,
  //     dependant_phone: values.dependant_phone,
  //     dependant_position: values.dependant_position,
  //     segment: values.segment,
  //     consultor: values.consultor ?? undefined,
  //     dedication: values.dedication ?? undefined,
  //     company_size: values.company_size ?? undefined,
  //   }).unwrap();
  //   toastHandler(TOAST_TYPE.SUCCESS_TOAST, "Actualizado Correctamente");
  //   dispatch(setUpdateCompany(updatedCompany));
  // };

  // const createCompany = async (values: CompanyDTO) => {
  //   values.nit = removeHyphen(values.nit, "-");
  //   values.acquired_certification =
  //     values.acquired_certification == ""
  //       ? null
  //       : values.acquired_certification;
  //   values.activities_ciiu =
  //     values.activities_ciiu == "" ? null : values.activities_ciiu;
  //   values.diagnosis = values.diagnosis == "" ? null : values.diagnosis;
  //   const savedCompany = await save(values).unwrap(); //Metodo que guarda
  //   toastHandler(TOAST_TYPE.SUCCESS_TOAST, "Registrado Correctamente");
  //   dispatch(setCompany(savedCompany));
  // };

  const handleSubmit = async (values: CompanyDTO) => {
    try {
      if (id) {
        //Aqui se edita
        await changeCompany(id, values);
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
              nit: formatNIT(fetchCompany.nit),
              diagnosis: fetchCompany.diagnosis,
              dependant: fetchCompany.dependant,
              dependant_phone: fetchCompany.dependant_phone,
              dependant_position: fetchCompany.dependant_position,
              segment: fetchCompany.segment_detail.id || 0,
              consultor: fetchCompany.consultor_detail?.id ?? null,
              size: fetchCompany.size_detail?.id ?? null,
              mission: fetchCompany.mission_detail.id,
              arl: fetchCompany.arl_detail.id,
            });
          }
          // setDedicationId(fetchCompany?.dedication_detail.id);
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
                    onChange={(e) => {
                      props.setFieldValue("nit", formatNIT(e.target.value));
                    }}
                    onBlur={props.handleBlur}
                    value={props.values.nit}
                  />
                </FloatLabel>
                {props.touched.nit && props.errors.nit ? (
                  <div className="text-red-600">{props.errors.nit}</div>
                ) : null}
              </div>
              <div className="col-span-12 md:col-span-3">
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
              <div className="col-span-12 md:col-span-3">
                <FloatLabel label="Arl a la que pertenece">
                  <Select
                    showSearch
                    optionFilterProp="label"
                    onSearch={onSearchArl}
                    loading={loadArl}
                    options={arloptions}
                    className="w-full"
                    onChange={(value) => props.setFieldValue("arl", value)}
                    onBlur={props.handleBlur}
                    value={props.values.arl}
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
                <FloatLabel label="Segmento al que pertenece">
                  <Select
                    showSearch
                    optionFilterProp="label"
                    onSearch={onSearchSegments}
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
                <FloatLabel label="Consultor a cargo">
                  <Select
                    showSearch
                    optionFilterProp="label"
                    onSearch={onSearchConsultands}
                    loading={loadConsultants}
                    options={consultandOptions}
                    className="w-full"
                    onChange={(value) =>
                      props.setFieldValue("consultor", value)
                    }
                    onBlur={props.handleBlur}
                    value={props.values.consultor}
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
                <FloatLabel label="Cargo de contacto">
                  <Input
                    id="dependant_position"
                    name="dependant_position"
                    value={props.values.dependant_position ?? ""}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  />
                </FloatLabel>
                {props.touched.dependant && props.errors.dependant ? (
                  <div className="text-red-600">{props.errors.dependant}</div>
                ) : null}
              </div>
              <div className="col-span-12 md:col-span-6">
                <FloatLabel label="Misionalidad de la empresa">
                  <Select
                    showSearch
                    optionFilterProp="label"
                    onSearch={onSearchDedications}
                    loading={loadDedications}
                    options={dedicationOptions}
                    className="w-full"
                    onChange={(value) => {
                      // setDedicationId(value);
                      props.setFieldValue("mission", value);
                    }}
                    onBlur={props.handleBlur}
                    value={props.values.mission}
                  />
                </FloatLabel>
                {props.touched.segment && props.errors.segment ? (
                  <div className="text-red-600">{props.errors.segment}</div>
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
              <div className="col-span-12 md:col-span-3">
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
              {/* <div className="col-span-12 md:col-span-6">
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
              </div> */}

              {/* <div className="col-span-12 md:col-span-3">
                <FloatLabel label="Tamaño de la empresa">
                  <Select
                    showSearch
                    optionFilterProp="label"
                    onSearch={onSearchCompanySize}
                    loading={loadCompanySize}
                    options={companySizeOptions}
                    className="w-full"
                    onChange={(value) =>
                      props.setFieldValue("company_size", value)
                    }
                    onBlur={props.handleBlur}
                    value={props.values.company_size}
                  />
                </FloatLabel>
                {props.touched.segment && props.errors.segment ? (
                  <div className="text-red-600">{props.errors.segment}</div>
                ) : null}
              </div> */}
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
