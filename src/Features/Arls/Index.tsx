import HeaderTitle from "@/Components/HeaderTitle";
import { Button, Modal, Skeleton } from "antd";
import React, { lazy, Suspense } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoBusiness } from "react-icons/io5";
import { CiSaveDown1 } from "react-icons/ci";
import ArlForm from "./Components/ArlForm";
import { useModal } from "@/hooks/utilsHooks";

const DataTable = lazy(() => import("./Components/DataTable"));

export default function ArlPage() {
  const { isOpen, open, close } = useModal();

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
          onClick={open}
        >
          Agregar Arl
        </Button>
      </div>
      <Suspense fallback={<Skeleton />}>
        <DataTable />
      </Suspense>

      <Modal
        title={
          <span className="flex items-center justify-start">
            {" "}
            <CiSaveDown1 className="mr-2" />
            Agregar Arl
          </span>
        }
        centered
        open={isOpen}
        onOk={close}
        onCancel={close}
        footer={null}
      >
        <ArlForm />
      </Modal>
    </div>
  );
}
