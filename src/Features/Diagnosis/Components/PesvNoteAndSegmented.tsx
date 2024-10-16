import { MisionalitySizeCriteria } from "@/interfaces/Dedication";
import { ConfigProvider, Input, Segmented } from "antd";
import React, { useEffect, useState } from "react";
import { determineCompanySize } from "../utils/functions";
import { useAppSelector } from "@/stores/hooks";
import { companyService } from "@/stores/services/companyService";
import { skipToken } from "@reduxjs/toolkit/query";

export default function PesvNoteAndSegmented({
  size,
  setSize,
  userChanged,
  observationChanged,
  setObservationChanged,
  setUserChanged,
  company,
  is_in_count,
  isExternal,
}: any) {
  const [sizeCompany, setSizeCompany] = useState<
    MisionalitySizeCriteria[] | null
  >(null);

  const { data: sizeData } =
    companyService.useFindcompanySizeByDedicactionIdQuery(
      company ? { id: company.mission_detail.id } : skipToken
    );

  const totalVehicles = useAppSelector(
    (state) => state.vehicleQuestion.totalQuantity
  );
  const totalDrivers = useAppSelector(
    (state) => state.driverQuestion.totalQuantity
  );
  useEffect(() => {
    if (sizeCompany) {
      if (is_in_count) {
        setSize(
          determineCompanySize(sizeCompany, totalVehicles, totalDrivers) ?? 0
        );
        setUserChanged(false);
      }
    }
  }, [is_in_count, sizeCompany, totalVehicles, totalDrivers, company]);

  // //(sizeData);
  useEffect(() => {
    if (sizeData) {
      setSizeCompany(sizeData);
    }
  }, [sizeData, company]);

  const defaultColors = {
    itemActiveBg: "#007bff",
    itemColor: "#000",
    itemHoverBg: "#f0f0f0",
    itemHoverColor: "#333333",
    itemSelectedBg: "#ffffff",
    itemSelectedColor: "#fff",
    trackBg: "#f5f5f5",
  };
  const conditionalColors: any = {
    1: {
      itemActiveBg: "#28a745",
      itemColor: "#BABABA",
      itemSelectedBg: "#6cffc3",
      itemSelectedColor: "#fff",
    },
    2: {
      itemActiveBg: "#6c91ff",
      itemColor: "#BABABA",
      itemSelectedBg: "#6c91ff",
      itemSelectedColor: "#fff",
    },
    3: {
      itemActiveBg: "#ffc107",
      itemColor: "#BABABA",
      itemSelectedBg: "#ff6c6c",
      itemSelectedColor: "#fff",
    },
  };
  const colors = conditionalColors[size] || defaultColors;

  const segmentedOptions = sizeCompany?.map((size) => ({
    label: size.size_detail.name, // Assuming CompanySize has a 'name' property
    value: size.size_detail.id, // Assuming CompanySize has an 'id' property
  }));

  const handleSegmentChange = (newSize: number) => {
    setSize(newSize);
    setUserChanged(true); // Mark that the user has manually changed the segment
  };
  return (
    <div className="col-span-6 mt-4">
      <span className="font-bold mr-1">Nota:</span>
      <small>
        El nivel del PESV es auto calculado
        {isExternal
          ? "."
          : ", sin embargo si se desea cambiar  debe seleccionar una opción y dejar la observacion del por que lo cambia"}
      </small>
      <ConfigProvider
        theme={{
          components: {
            Segmented: {
              ...colors,
            },
          },
        }}
      >
        <Segmented
          className="mb-2"
          options={segmentedOptions || []}
          block
          value={size}
          onChange={isExternal ? () => null : handleSegmentChange}
        />
      </ConfigProvider>
      {/* Conditionally render the TextArea if the user manually changed the segment */}
      {userChanged && (
        <Input.TextArea
          rows={1}
          placeholder="En caso de que se cambie el nivel del PESV"
          autoSize={{ minRows: 1, maxRows: 6 }}
          value={observationChanged ?? ""}
          onChange={(e) =>
            setObservationChanged(e.target.value == "" ? null : e.target.value)
          }
        />
      )}
    </div>
  );
}
