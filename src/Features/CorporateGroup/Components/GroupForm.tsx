import FloatLabel from "@/Components/FloatLabel";
import { Company } from "@/interfaces/Company";
import { companyService } from "@/stores/services/companyService";
import { formatNIT } from "@/utils/utilsMethods";
import { Button, Input, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { CiSaveDown1 } from "react-icons/ci";
import { IoBusiness } from "react-icons/io5";

export default function GroupForm() {
  const { data: fetchCompanies, isLoading: isLoadingFetchCompany } =
    companyService.useFindAllQuery({
      arlId: null,
    });

  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);

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
  return (
    <>
      <form className="flex flex-col justify-evenly relative">
        <div className="grid grid-cols-12 gap-4 gap-y-8 mt-4">
          <div className="col-span-12">
            <FloatLabel label="Nombre del grupo">
              <Input id="name" name="name" type="text" />
            </FloatLabel>
          </div>
          <div className="col-span-12">
            <FloatLabel label="Empresas">
              <Select
                showSearch
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
              />
            </FloatLabel>
          </div>
        </div>
        <div className="col-span-12 flex items-center justify-center mt-4">
          <Button
            htmlType="submit"
            icon={<CiSaveDown1 />}
            size="large"
            className={"bg-green-500 border-2 border-green-400 text-white"}
          >
            Guardar
          </Button>
        </div>
      </form>
    </>
  );
}
