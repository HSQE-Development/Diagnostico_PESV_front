import HeaderTitle from "@/Components/HeaderTitle";
import { Button, Modal } from "antd";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoBusiness } from "react-icons/io5";
import DataTable from "./Components/DataTable";
import { CiSaveDown1 } from "react-icons/ci";
import ArlForm from "./Components/ArlForm";

export default function ArlPage() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-col md:flex-row items-center justify-between md:p-8">
        <HeaderTitle
          icon={<IoBusiness />}
          title="Gestión de las Arls"
          subTitle="Añade, actualiza, elimina y gestiona toda la información de las
          arls"
        />
        <Button
          className="mt-8 mb-4 md:mt-0 md:mb-0"
          type="primary"
          icon={<IoMdAdd />}
          onClick={() => setOpen(true)}
        >
          Agregar Arl
        </Button>
      </div>
      <DataTable />

      <Modal
        title={
          <span className="flex items-center justify-start">
            {" "}
            <CiSaveDown1 className="mr-2" />
            Agregar Arl
          </span>
        }
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        footer={<></>}
      >
        <ArlForm />
      </Modal>
    </div>
  );
}
