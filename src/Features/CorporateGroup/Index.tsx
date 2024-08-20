import HeaderTitle from "@/Components/HeaderTitle";
import { Button, Modal } from "antd";
import React, { useState } from "react";
import { FaLayerGroup } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import DataDisplay from "./Components/DataDisplay";
import { CiSaveDown1 } from "react-icons/ci";
import GroupForm from "./Components/GroupForm";

export default function CorporateGroupPage() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-col">
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-between md:p-8">
          <HeaderTitle
            icon={<FaLayerGroup />}
            title="Gestión de los grupos empresariales"
            subTitle="Añade, actualiza, elimina y gestiona toda la información de los grupos empresariales"
          />
          <Button
            className="mt-8 mb-4 md:mt-0 md:mb-0"
            type="primary"
            icon={<IoMdAdd />}
            onClick={() => setOpen(true)}
          >
            Agregar grupo empresarial
          </Button>
        </div>
      </div>

      <DataDisplay />

      <Modal
        title={
          <span className="flex items-center justify-start">
            {" "}
            <CiSaveDown1 className="mr-2" />
            Agregar grupo empresarial
          </span>
        }
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={500}
        footer={<></>}
      >
        <GroupForm />
      </Modal>
    </>
  );
}
