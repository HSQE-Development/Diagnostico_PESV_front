import FloatLabel from "@/Components/FloatLabel";
import { IUser } from "@/interfaces/IUser";
import { userService } from "@/stores/services/userService";
import { Select } from "antd";
import React, { useEffect, useState } from "react";

export default function ConsultandSelect({
  consultorSelect,
  setConsultorSelect,
}: any) {
  //Consultas
  const { data: fetchConsultants, isLoading: loadConsultants } =
    userService.useFindAllConsultantsQuery();
  const [filteredConsultands, setFilteredConsultands] = useState<IUser[]>([]);

  useEffect(() => {
    if (fetchConsultants) {
      setFilteredConsultands(fetchConsultants);
    }
  }, [fetchConsultants]);

  const onSearchConsultands = (value: string) => {
    const filtered = filteredConsultands?.filter((consultand) => {
      if (consultand.first_name)
        consultand.first_name.toLowerCase().includes(value.toLowerCase());
    });
    setFilteredConsultands(filtered || []);
  };

  const consultandOptions = filteredConsultands.map((consultand) => ({
    value: consultand.id,
    label: consultand.first_name + " " + consultand.last_name,
  }));

  return (
    <div className="col-span-6 mt-4">
      <FloatLabel label="Consultor a cargo" obligatory>
        <Select
          showSearch
          optionFilterProp="label"
          onSearch={onSearchConsultands}
          loading={loadConsultants}
          options={consultandOptions}
          className="w-full"
          value={consultorSelect}
          onChange={(value) => setConsultorSelect(value)}
        />
      </FloatLabel>
    </div>
  );
}
