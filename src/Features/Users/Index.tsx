import HeaderTitle from "@/Components/HeaderTitle";
import { useModal } from "@/hooks/utilsHooks";
import { Button, Modal, Skeleton } from "antd";
import React, { lazy, Suspense } from "react";
import { CiSaveDown1 } from "react-icons/ci";
import { FaUserFriends } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
const DataTable = lazy(() => import("./Components/DataTable"));
const ProfileForm = lazy(() => import("../Profile/Components/ProfileForm"));

export default function UsersPage() {
  const { isOpen, open, close } = useModal();

  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-col md:flex-row items-center justify-between md:p-8">
        <HeaderTitle
          icon={<FaUserFriends />}
          title="Gestión de usuarios"
          subTitle="Añade, actualiza, elimina y gestiona toda la información de los usuarios de la app"
        />
        <Button
          className="mt-8 mb-4 md:mt-0 md:mb-0"
          type="primary"
          icon={<IoMdAdd />}
          onClick={open}
        >
          Agregar usuario
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
            Agregar Usuario
          </span>
        }
        centered
        open={isOpen}
        onOk={close}
        onCancel={close}
        footer={null}
      >
        <Suspense
          fallback={
            <Skeleton.Node children={<></>} className="w-full h-20" active />
          }
        >
          <ProfileForm />
        </Suspense>
      </Modal>
    </div>
  );
}
