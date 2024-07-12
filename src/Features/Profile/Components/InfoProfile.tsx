import { useAppSelector } from "@/stores/hooks";
import { Button, Image, Modal, Skeleton, Space } from "antd";
import React, { useState } from "react";
import { GrDocumentConfig } from "react-icons/gr";
import { IoIosNotificationsOutline } from "react-icons/io";
import {
  MdAlternateEmail,
  MdModeEdit,
  MdOutlineDocumentScanner,
} from "react-icons/md";

interface InfoProfileProps {
  isLoading: boolean;
}
export default function InfoProfile({ isLoading }: InfoProfileProps) {
  const [editModal, setEditModal] = useState<boolean>(false);
  const authUser = useAppSelector((state) => state.auth.authUser);

  return (
    <>
      <div className=" flex flex-col items-center justify-start gap-y-8">
        {isLoading ? (
          <>
            <div className="flex flex-col justify-center items-center gap-y-4 my-4">
              <Space>
                <Skeleton.Avatar
                  active={isLoading}
                  size={200}
                  shape={"circle"}
                />
              </Space>
              <Skeleton.Input active={isLoading} size={"large"} />
              <Skeleton.Input active={isLoading} size={"small"} />
            </div>
          </>
        ) : (
          <>
            <Image
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              className="rounded-full my-5 w-72 px-2"
            />
            <div className="flex flex-col items-center">
              <span className="">
                {authUser?.user.first_name} {authUser?.user.last_name}
              </span>
              <span className="font-bold text-black">SuperUser</span>
            </div>
          </>
        )}
        {}
        <div className="flex flex-col md:flex-row flex-1 justify-evenly items-center gap-2">
          {/* <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimary: `orange`,
                  colorPrimaryHover: `bg-orange-400`,
                  colorPrimaryActive: `bg-orange-200`,
                  lineWidth: 0,
                },
              },
            }}
          >
          </ConfigProvider> */}
          {isLoading ? (
            <>
              <Skeleton.Button active={isLoading} size={"default"} />
              <Skeleton.Button active={isLoading} size={"default"} />
            </>
          ) : (
            <>
              <Button
                type="primary"
                size="large"
                icon={<MdModeEdit />}
                onClick={() => setEditModal(true)}
                className="w-full md:w-auto bg-black"
              >
                Editar
              </Button>
              <Button size="large" icon={<IoIosNotificationsOutline />}>
                Notificaciones
              </Button>
            </>
          )}
        </div>
        {isLoading ? (
          <>
            <Skeleton.Input active={isLoading} size={"large"} />
            <Skeleton.Input active={isLoading} size={"large"} />
            <Skeleton.Input active={isLoading} size={"large"} />
          </>
        ) : (
          <>
            <div className="flex flex-col w-[80%] gap-4 bg-slate-200 p-2 rounded-md">
              <div className="flex flex-col items-start justify-center">
                <div className="flex items-center justify-start">
                  <MdAlternateEmail className="font-bold" />
                  <span className="ml-2 font-bold">Email</span>
                </div>
                <span className="ml-4">{authUser?.user.email}</span>
              </div>
            </div>
            <div className="flex flex-col w-[80%] gap-4 bg-slate-200 p-2 rounded-md">
              <div className="flex flex-col items-start justify-center">
                <div className="flex items-center justify-start">
                  <MdOutlineDocumentScanner className="font-bold" />
                  <span className="ml-2 font-bold">Cédula</span>
                </div>
                <span className="ml-4">{authUser?.user.cedula}</span>
              </div>
            </div>
            <div className="flex flex-col w-[80%] gap-4 bg-slate-200 p-2 rounded-md mb-4">
              <div className="flex flex-col items-start justify-center">
                <div className="flex items-center justify-start">
                  <GrDocumentConfig className="font-bold" />
                  <span className="ml-2 font-bold">Licensia</span>
                </div>
                <span className="ml-4">
                  {authUser?.user.licensia_sst
                    ? authUser?.user.licensia_sst
                    : "Sin Licencia"}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal
        title="Editar Perfil"
        centered
        open={editModal}
        onCancel={() => setEditModal(false)}
        footer={<></>}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
    </>
  );
}
