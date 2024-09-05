import AutoShadowImage from "@/Components/AutoShadowImage";
import { useAppSelector } from "@/stores/hooks";
import { getColorByRole, getUservatarUrl } from "@/utils/getUserAvatarImage";
import { Badge, Button, Modal, Skeleton, Space } from "antd";
import React, { useState } from "react";
import { GrDocumentConfig } from "react-icons/gr";
import {
  MdAlternateEmail,
  MdModeEdit,
  MdOutlineDocumentScanner,
} from "react-icons/md";
import ProfileForm from "./ProfileForm";

interface InfoProfileProps {
  isLoading: boolean;
  profileId?: number;
}
export default function InfoProfile({
  isLoading,
  profileId,
}: InfoProfileProps) {
  const [editModal, setEditModal] = useState<boolean>(false);
  const authUser = useAppSelector((state) => state.auth.authUser);

  const avatarUrl = getUservatarUrl(authUser?.user?.avatar ?? "");

  return (
    <>
      <div className=" flex flex-col items-center justify-start gap-y-8 w-full">
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
            <AutoShadowImage src={avatarUrl} />
            <div className="flex flex-col items-center">
              <span className="">
                {authUser?.user.first_name} {authUser?.user.last_name}
              </span>
              <div className="flex justify-center items-center gap-1 flex-wrap">
                {authUser?.user?.groups_detail.map((group, index) => (
                  <Badge
                    key={index}
                    count={group.name}
                    color={getColorByRole(group.name).hex}
                  />
                ))}
              </div>
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
                <span className="ml-4 overflow-hidden text-ellipsis break-all">
                  {authUser?.user.email}
                </span>
              </div>
            </div>
            <div className="flex flex-col w-[80%] gap-4 bg-slate-200 p-2 rounded-md">
              <div className="flex flex-col items-start justify-center">
                <div className="flex items-center justify-start">
                  <MdOutlineDocumentScanner className="font-bold" />
                  <span className="ml-2 font-bold">Cédula</span>
                </div>
                <span className="ml-4 overflow-hidden text-ellipsis break-all">
                  {authUser?.user.cedula}
                </span>
              </div>
            </div>
            <div className="flex flex-col w-[80%] gap-4 bg-slate-200 p-2 rounded-md mb-4">
              <div className="flex flex-col items-start justify-center">
                <div className="flex items-center justify-start">
                  <GrDocumentConfig className="font-bold" />
                  <span className="ml-2 font-bold">Licensia</span>
                </div>
                <span className="ml-4 overflow-hidden text-ellipsis break-all">
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
        <ProfileForm id={authUser?.user.id ?? 0} />
      </Modal>
    </>
  );
}
