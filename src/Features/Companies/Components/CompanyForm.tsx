import FloatLabel from "@/Components/FloatLabel";
import { useCorporate } from "@/context/CorporateGroupContext";
import useCompany from "@/hooks/companyHooks";
import { Arl } from "@/interfaces/Arl";
import { Ciiu, CompanyDTO } from "@/interfaces/Company";
import { ConfigComun } from "@/interfaces/Comun";
import { Mission } from "@/interfaces/Dedication";
import { setSegments } from "@/stores/features/segmentSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { arlService } from "@/stores/services/arlService";
import { companyService } from "@/stores/services/companyService";
import { segmentService } from "@/stores/services/segmentServices";
import { TOAST_TYPE, toastHandler } from "@/utils/useToast";
import { encryptId, formatNIT } from "@/utils/utilsMethods";
import { skipToken } from "@reduxjs/toolkit/query";
import { Button, Input, Select, Space } from "antd";
import { Formik } from "formik";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { CiSaveDown1 } from "react-icons/ci";
import { MdEdit, MdNavigateNext } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

interface CompanyFormProps extends Partial<ConfigComun> {
  id?: number;
  onlyCreate?: boolean;
  isUseOut?: boolean;
}

const initialValues: CompanyDTO = {
  name: "",
  email: "",
  nit: "",
  dependant: "",
  dependant_phone: "",
  dependant_position: "",
  acquired_certification: "",
  segment: null,
  size: null,
  mission: null,
  arl: null,
  ciius: null,
};

export default function CompanyForm({
  id,
  onlyCreate,
  isUseOut,
  isExternal,
}: CompanyFormProps) {
  const { setCorporateId, isExternal: external_user } = useCorporate();
  const [createOnly, setCreateOnly] = useState<boolean | undefined>(onlyCreate);
  const navigate = useNavigate();
  const { changeCompany, createCompany, isSaving, isUpdating } = useCompany();
  const { data: fetchSegments, isLoading } = segmentService.useFindAllQuery();
  const { data: fetchArl, isLoading: loadArl } = arlService.useFindAllQuery();

  const { data: fetchDedications, isLoading: loadDedications } =
    companyService.useFindAllDedicationsQuery();

  const { data: fetchCompany } = companyService.useFindByIdQuery(
    id ? { id } : skipToken
  );

  const dispatch = useAppDispatch();
  const segments = useAppSelector((state) => state.segment.segments);
  const [filteredSegments, setFilteredSegments] = useState(segments || []);
  const [filteredArl, setFilteredArl] = useState<Arl[]>([]);
  const [filteredDedications, setFiltereddedications] = useState<Mission[]>([]);
  const [filteredCiiu, setFilteredCiiu] = useState<Ciiu[]>([]);
  const [searchValue] = useState<string>("");
  const [codeCiiu, setCodeCiiu] = useState<string>("");

  const { data: fetchCiiu, isLoading: loadCiiu } =
    companyService.useFindCiiuByCodeQuery({
      codeCiiu,
    });

  useEffect(() => {
    if (fetchSegments) {
      dispatch(setSegments(fetchSegments));
      setFilteredSegments(fetchSegments);
    }
  }, [fetchSegments]);
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
  useEffect(() => {
    if (!loadCiiu && fetchCiiu && Array.isArray(fetchCiiu)) {
      setFilteredCiiu(fetchCiiu);
    }
  }, [fetchCiiu, loadCiiu]);

  // Función de búsqueda con debounce
  const debouncedSearch = debounce((value: string) => {
    setCodeCiiu(value); // Actualiza el parámetro de búsqueda para hacer la consulta
  }, 300);

  useEffect(() => {
    debouncedSearch(searchValue);
  }, [searchValue, debouncedSearch]);

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
  const onSearchDedications = (value: string) => {
    const filtered = filteredDedications?.filter((dedication) => {
      if (dedication.name)
        dedication.name.toLowerCase().includes(value.toLowerCase());
    });
    setFiltereddedications(filtered || []);
  };
  // const onSearchChangeCiiu = (value: string) => {
  //   setSearchValue(value);
  // };

  const arloptions = filteredArl.map((segment) => ({
    value: segment.id,
    label: segment.name,
  }));
  const segmentOptions = filteredSegments.map((segment) => ({
    value: segment.id,
    label: segment.name,
  }));

  const dedicationOptions = filteredDedications.map((dedication) => ({
    value: dedication.id,
    label: dedication.name,
  }));
  const ciiuOptions = filteredCiiu.map((ciiu) => ({
    value: ciiu.id,
    label: `${ciiu.code} - ${ciiu.name}`,
    emoji: ciiu.code,
  }));

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Campo Obligatorio"),
    email: Yup.string().email("Correo electronico invalido"),
    // .required("Campo Obligatorio"),
    nit: Yup.string().required("Campo Obligatorio"),
    // diagnosis: Yup.string().required("Campo Obligatorio"),
    // dependant: Yup.string().required("Campo Obligatorio"),
    // dependant_phone: Yup.string().required("Campo Obligatorio"),
    // acquired_certification: Yup.string().required("Campo ObligatoriformatNIT(e.target.value)o"),
    segment: Yup.number().required("Campo Obligatorio"),
  });

  const handleSubmit = async (values: CompanyDTO) => {
    try {
      if (id) {
        //Aqui se edita
        await changeCompany(id, values);
      } else {
        // Aqui se registra
        setCorporateId(undefined);
        const saveCompany = await createCompany(values, external_user);
        if (saveCompany) {
          if (!createOnly) {
            navigate(
              `/app/companies/diagnosis/${encryptId(saveCompany.id.toString())}`
            );
          }
        }
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
              nit: formatNIT(fetchCompany.nit),
              dependant: fetchCompany.dependant,
              dependant_phone: fetchCompany.dependant_phone,
              dependant_position: fetchCompany.dependant_position,
              segment: fetchCompany.segment_detail.id || 0,
              size: fetchCompany.size_detail?.id ?? null,
              mission: fetchCompany.mission_detail.id,
              arl: fetchCompany.arl_detail.id,
              ciius: fetchCompany.ciius_detail?.map((ciiu) => ciiu.id) ?? null,
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
                    status={
                      props.touched.nit && props.errors.nit ? "error" : ""
                    }
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
                <FloatLabel label="Codigos ciiu">
                  <Select
                    showSearch
                    value={props.values.ciius}
                    mode="multiple"
                    style={{ width: "100%" }}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase()) ||
                      (option?.emoji ?? "").includes(input)
                    }
                    options={ciiuOptions}
                    virtual
                    loading={loadCiiu}
                    allowClear
                    optionRender={(option) => (
                      <Space>
                        <span className="text-xs font-bold">
                          {option.data.emoji}
                        </span>
                        <span>{option.data.label}</span>
                      </Space>
                    )}
                    labelRender={(option) => (
                      <>
                        <span>{option.label}</span>
                      </>
                    )}
                    onChange={(value) => props.setFieldValue("ciius", value)}
                  />
                </FloatLabel>
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
              {/* <div className="col-span-12 md:col-span-3">
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
              </div> */}
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
            <div className="col-span-12 flex items-center justify-center mt-4 gap-4">
              {!isUseOut && (
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
                  {id ? "Editar" : "Guardar y empezar diagnostico"}
                </Button>
              )}
              {!id && (
                <Button
                  type="dashed"
                  htmlType="submit"
                  icon={
                    id ? (
                      <MdEdit />
                    ) : isExternal ? (
                      <MdNavigateNext />
                    ) : (
                      <CiSaveDown1 />
                    )
                  }
                  iconPosition={isExternal ? "end" : "start"}
                  size="large"
                  className={`border-purple-950 text-purple-700 hover:bg-purple-100 active:bg-purple-200`}
                  loading={isSaving || isUpdating}
                  onClick={() => setCreateOnly(true)}
                >
                  {isExternal ? "Continuar" : "Guardar"}
                </Button>
              )}
            </div>
          </form>
        );
      }}
    </Formik>
  );
}
