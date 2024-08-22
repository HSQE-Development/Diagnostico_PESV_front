import HeaderTitle from "@/Components/HeaderTitle";
import { Button, Modal, Skeleton } from "antd";
import React, { lazy, Suspense } from "react";
import { FaLayerGroup } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { CiSaveDown1 } from "react-icons/ci";
import GroupForm from "./Components/GroupForm";
import { useModal } from "@/hooks/utilsHooks";

const DataDisplay = lazy(() => import("./Components/DataDisplay"));

export default function CorporateGroupPage() {
  const { isOpen, open, close } = useModal();

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
            onClick={open}
          >
            Agregar grupo empresarial
          </Button>
        </div>
      </div>
      <Suspense fallback={<Skeleton avatar paragraph={{ rows: 4 }} active />}>
        <DataDisplay />
      </Suspense>

      <Modal
        title={
          <span className="flex items-center justify-start">
            {" "}
            <CiSaveDown1 className="mr-2" />
            Agregar grupo empresarial
          </span>
        }
        centered
        open={isOpen}
        onOk={close}
        onCancel={close}
        width={500}
        footer={null}
      >
        <GroupForm />
      </Modal>
    </>
  );
}
