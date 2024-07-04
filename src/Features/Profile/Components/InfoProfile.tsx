import { Button, ConfigProvider, FloatButton, Image, Modal } from "antd";
import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { GrDocumentConfig } from "react-icons/gr";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdAlternateEmail, MdModeEdit, MdOutlineDocumentScanner } from "react-icons/md";

export default function InfoProfile() {
  const [editModal, setEditModal] = useState<boolean>(false);

  return (
    <>
      <div className=" flex flex-col items-center justify-start gap-y-8">
        <Image
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          className="rounded-full my-5 w-72 px-2"
        />
        <div className="flex flex-col items-center">
          <span className="">Daniel Esteban Rodriguezss</span>
          <span className="font-bold text-blue-800">SuperUser</span>
        </div>
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
        </div>
        <div className="flex flex-col w-[80%] gap-4 bg-slate-200 p-2 rounded-md">
          <div className="flex flex-col items-start justify-center">
            <div className="flex items-center justify-start">
              <MdAlternateEmail  className="font-bold"/>
              <span className="ml-2 font-bold">Email</span>
            </div>
            <span>daniel@daniel.com</span>
          </div>
        </div>
        <div className="flex flex-col w-[80%] gap-4 bg-slate-200 p-2 rounded-md">
          <div className="flex flex-col items-start justify-center">
            <div className="flex items-center justify-start">
              <MdOutlineDocumentScanner  className="font-bold"/>
              <span className="ml-2 font-bold">Cédula</span>
            </div>
            <span>daniel@daniel.com</span>
          </div>
        </div>
        <div className="flex flex-col w-[80%] gap-4 bg-slate-200 p-2 rounded-md">
          <div className="flex flex-col items-start justify-center">
            <div className="flex items-center justify-start">
              <GrDocumentConfig  className="font-bold"/>
              <span className="ml-2 font-bold">Licensia</span>
            </div>
            <span>daniel@daniel.com</span>
          </div>
        </div>
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
