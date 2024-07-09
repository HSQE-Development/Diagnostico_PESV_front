import HeaderTitle from "@/Components/HeaderTitle";
import { Button, Modal } from "antd";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoBusiness } from "react-icons/io5";
import DataTable from "./Components/DataTable";
import CompanyForm from "./Components/CompanyForm";
import { CiSaveDown1 } from "react-icons/ci";

export default function CompanyPage() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-col md:flex-row items-center justify-between md:p-8">
        <HeaderTitle
          icon={<IoBusiness />}
          title="Gestión de las empresas"
          subTitle="Añade, actualiza, elimina y gestiona toda la información de las
          empresas"
        />
        <Button className="mt-8 mb-4 md:mt-0 md:mb-0" type="primary" icon={<IoMdAdd />} onClick={() => setOpen(true)}>
          Agregar Empresa
        </Button>
      </div>
      <DataTable />

      <Modal
        title={<span className="flex items-center justify-start"> <CiSaveDown1 className="mr-2" />Agregar Empresa</span>}
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
        footer={<></>}
      >
        <CompanyForm/>
      </Modal>
    </div>
  );
}
