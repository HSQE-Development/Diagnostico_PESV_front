import FloatLabel from "@/Components/FloatLabel";
import { Company } from "@/interfaces/Company";
import { CorporateDTO } from "@/interfaces/CorporateGroup";
import { setCorporateGroup } from "@/stores/features/corporateGroupSlice";
import { useAppDispatch } from "@/stores/hooks";
import { companyService } from "@/stores/services/companyService";
import { corporateGroupService } from "@/stores/services/corporateGroupService";
import { TOAST_TYPE, toastHandler } from "@/utils/useToast";
import { formatNIT } from "@/utils/utilsMethods";
import { Button, Input, Select, Space } from "antd";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { CiSaveDown1 } from "react-icons/ci";
import { IoBusiness } from "react-icons/io5";
import * as Yup from "yup";

const initialValues: CorporateDTO = {
  name: "",
  companies: [],
  diagnosis: null,
};

export default function GroupForm() {
  const dispatch = useAppDispatch();

  const { data: fetchCompanies, isLoading: isLoadingFetchCompany } =
    companyService.useFindAllQuery({
      arlId: null,
    });

  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [saveCorporateGroup, { isLoading }] =
    corporateGroupService.useSaveCorporateGroupMutation();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Campo Obligatorio"),
  });

  useEffect(() => {
    if (fetchCompanies) {
      setFilteredCompanies(fetchCompanies);
    }
  }, [fetchCompanies]);

  const companyoptions = filteredCompanies.map((company) => ({
    value: company.id,
    label: (
      <span className="flex items-center justify-start">
        <IoBusiness className="mr-2" />
        <span className="font-semibold">{formatNIT(company.nit)}</span>
        {" - "}
        <span>{company.name}</span>
      </span>
    ),
    filter_data: `${company.nit} - ${company.name}`,
  }));

  const handleSubmit = async (values: CorporateDTO) => {
    try {
      const savedGroups = await saveCorporateGroup(values).unwrap();
      dispatch(setCorporateGroup(savedGroups));
      toastHandler(TOAST_TYPE.SUCCESS_TOAST, "Registrado Correctamente");
    } catch (error: any) {
      //("ERROR", error);
      toastHandler(TOAST_TYPE.ERROR_TOAST, error.data.error);
    }
  };

  return (
    <>
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
          return (
            <form
              onSubmit={props.handleSubmit}
              className="flex flex-col justify-evenly relative"
            >
              <div className="grid grid-cols-12 gap-4 gap-y-8 mt-4">
                <div className="col-span-12">
                  <FloatLabel label="Nombre del grupo">
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={props.values.name}
                      onChange={props.handleChange}
                    />
                  </FloatLabel>
                </div>
                <div className="col-span-12">
                  <FloatLabel label="Empresas">
                    <Select
                      showSearch
                      value={props.values.companies}
                      mode="multiple"
                      style={{ width: "100%" }}
                      virtual
                      allowClear
                      loading={isLoadingFetchCompany}
                      options={companyoptions}
                      optionRender={(option) => (
                        <Space>
                          <span>{option.data.label}</span>
                        </Space>
                      )}
                      filterOption={(input, option) =>
                        (option?.filter_data ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      onChange={(value) =>
                        props.setFieldValue("companies", value)
                      }
                    />
                  </FloatLabel>
                </div>
              </div>
              <div className="col-span-12 flex items-center justify-center mt-4">
                <Button
                  htmlType="submit"
                  icon={<CiSaveDown1 />}
                  size="large"
                  className={
                    "bg-green-500 border-2 border-green-400 text-white"
                  }
                  loading={isLoading}
                >
                  Guardar
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    </>
  );
}
