import FloatLabel from "@/Components/FloatLabel";
import { UserDTO } from "@/interfaces/IUser";
import { authService } from "@/stores/services/authService";
import { getUservatarUrl } from "@/utils/getUserAvatarImage";
import { Button, Image, Input, Select, Space, Upload, UploadFile } from "antd";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { CiCircleInfo, CiSaveDown1 } from "react-icons/ci";
import * as Yup from "yup";
import useUser from "@/hooks/userHooks";
import { TOAST_TYPE, toastHandler } from "@/utils/useToast";
import { UploadChangeParam } from "antd/es/upload";
import {
  FileTypeGetBase64Antd,
  getBase64Antd,
  getFileBase64,
} from "@/utils/utilsMethods";
import { useAppSelector } from "@/stores/hooks";
import { Group } from "@/interfaces/Group";
import { userService } from "@/stores/services/userService";
import { GoEye } from "react-icons/go";
import { IoEyeOff } from "react-icons/io5";

const initialValues: UserDTO = {
  first_name: "",
  last_name: "",
  password: "",
  email: "",
  avatar: "",
  cedula: "",
  licensia_sst: "",
  groups: [],
};

type ProfileProps = {
  id?: number;
  useExternal?: boolean;
};
export default function ProfileForm({ id, useExternal }: ProfileProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { changeUser, updateLoading, createUser, createLoading } = useUser();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [filterGroup, setFilterGroup] = useState<Group[]>([]);

  const { data: fetchGroups, isLoading: loadGroups } =
    userService.useFindAllGroupsQuery();

  const { data: fetchDataUser, isLoading } = authService.useFindByIdQuery({
    user: id,
  });

  useEffect(() => {
    if (!loadGroups && fetchGroups && Array.isArray(fetchGroups)) {
      setFilterGroup(fetchGroups);
    }
  }, [fetchGroups, loadGroups]);

  const groupOptions = filterGroup.map((ciiu) => ({
    value: ciiu.id,
    label: ciiu.name,
  }));

  const authUser = useAppSelector((state) => state.auth.authUser);
  const is_my_profile = authUser?.user.id === id;
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("Campo Obligatorio"),
    last_name: Yup.string().required("Campo Obligatorio"),
    email: Yup.string()
      .required("Campo Obligatorio")
      .email("Ingrese un correo valido"),
    cedula: Yup.string()
      .required("Campo Obligatorio")
      .min(10, "La cedula debe tener almenos 10 caracteres"),
  });

  const handleSubmit = async (values: UserDTO) => {
    try {
      const updatedValues = { ...values };

      // Si el avatar es una URL (ya existente), no lo enviamos
      if (updatedValues.avatar && updatedValues.avatar.startsWith("/media/")) {
        delete updatedValues.avatar;
      }

      if (id) {
        //Aqui se edita
        await changeUser(id, updatedValues, is_my_profile);
      } else {
        // Aqui se registra
        await createUser(values);
      }
    } catch (error: any) {
      toastHandler(TOAST_TYPE.ERROR_TOAST, error.data.error);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64Antd(
        file.originFileObj as FileTypeGetBase64Antd
      );
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, actions) => {
        await handleSubmit(values);
        actions.setSubmitting(false);
        actions.setFieldValue("password", "");
      }}
      enableReinitialize
    >
      {(props) => {
        const handleUploadChange = async (
          info: UploadChangeParam<UploadFile<any>>
        ) => {
          const file = info.file.originFileObj;
          if (file) {
            try {
              const base64 = await getFileBase64(file);
              setPreviewImage(base64);
              props.setFieldValue("avatar", base64); // Guardar el Base64 en el campo 'avatar'

              setFileList([
                {
                  uid: info.file.uid,
                  name: info.file.name,
                  status: "done",
                  url: base64,
                },
              ]);
            } catch (error) {
              toastHandler(TOAST_TYPE.ERROR_TOAST, "Error al cargar la imagen");
            }
          }
        };
        useEffect(() => {
          if (fetchDataUser) {
            props.setValues({
              first_name: fetchDataUser.first_name ?? "",
              last_name: fetchDataUser.last_name ?? "",
              cedula: fetchDataUser.cedula,
              licensia_sst: fetchDataUser.licensia_sst,
              avatar: fetchDataUser.avatar,
              password: fetchDataUser.password,
              groups: fetchDataUser.groups,
              email: fetchDataUser.email,
            });

            const url = getUservatarUrl(fetchDataUser.avatar ?? undefined);
            setFileList([
              {
                uid: "-1",
                name: "avatar.jpg",
                status: "done",
                url: url,
              },
            ]);
          }
          // setDedicationId(fetchArl?.dedication_detail.id);
        }, [fetchDataUser, id]);
        return (
          <form
            className="w-full flex flex-col items-stretch"
            onSubmit={props.handleSubmit}
          >
            <div className="flex items-center justify-center mb-4">
              <Upload
                fileList={fileList}
                showUploadList={{
                  showPreviewIcon: true,
                  showRemoveIcon: id ? false : true,
                }}
                accept="image/*"
                listType="picture-circle"
                onPreview={handlePreview}
                onChange={handleUploadChange}
              >
                {id ? "Cambiar Imagen de Perfil" : "Agregar foto de perfil"}
              </Upload>

              {previewImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </div>
            {!id && (
              <div className="flex items-center justify-start gap-2">
                <CiCircleInfo />
                <small>
                  Nota: Al correo registrado se enviara una contraseña al
                  usuario <br /> porfavor verifica que sea correcto.
                </small>
              </div>
            )}
            <div className="grid grid-cols-12 mt-8 gap-4 gap-y-6">
              <div className="col-span-6">
                <FloatLabel label="Nombre" obligatory>
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={props.values.first_name}
                    onChange={props.handleChange}
                  />
                </FloatLabel>
                {props.touched.first_name && props.errors.first_name ? (
                  <div className="text-red-600">{props.errors.first_name}</div>
                ) : null}
              </div>
              <div className="col-span-6">
                <FloatLabel label="Apellido" obligatory>
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={props.values.last_name}
                    onChange={props.handleChange}
                  />
                </FloatLabel>
                {props.touched.last_name && props.errors.last_name ? (
                  <div className="text-red-600">{props.errors.last_name}</div>
                ) : null}
              </div>
              <div className="col-span-6">
                <FloatLabel label="Email" obligatory>
                  <Input
                    id="email"
                    name="email"
                    type="text"
                    value={props.values.email}
                    onChange={props.handleChange}
                  />
                </FloatLabel>
                {props.touched.email && props.errors.email ? (
                  <div className="text-red-600">{props.errors.email}</div>
                ) : null}
              </div>
              <div className="col-span-6">
                <FloatLabel label="Cedula" obligatory>
                  <Input
                    id="cedula"
                    name="cedula"
                    type="text"
                    value={props.values.cedula}
                    onChange={props.handleChange}
                    maxLength={10}
                  />
                </FloatLabel>
                {props.touched.cedula && props.errors.cedula ? (
                  <div className="text-red-600">{props.errors.cedula}</div>
                ) : null}
              </div>
              {!useExternal && (
                <>
                  <div className="col-span-12">
                    <FloatLabel label="Licencia SST">
                      <Input
                        id="licensia_sst"
                        name="licensia_sst"
                        type="text"
                        value={props.values.licensia_sst ?? ""}
                        onChange={props.handleChange}
                      />
                    </FloatLabel>
                  </div>
                  {id && (
                    <div className="col-span-12">
                      <FloatLabel label="Cambiar contraseña">
                        <Input.Password
                          size="large"
                          className="p-4"
                          iconRender={(visible) =>
                            visible ? <GoEye /> : <IoEyeOff />
                          }
                          id="password"
                          name="password"
                          value={props.values.password ?? ""}
                          onChange={props.handleChange}
                        />
                      </FloatLabel>
                    </div>
                  )}
                  <div className="col-span-12">
                    <FloatLabel label="Permisos" obligatory>
                      <Select
                        showSearch
                        value={props.values.groups}
                        mode="multiple"
                        style={{ width: "100%" }}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={groupOptions}
                        virtual
                        loading={loadGroups}
                        allowClear
                        optionRender={(option) => (
                          <Space>
                            <span>{option.data.label}</span>
                          </Space>
                        )}
                        labelRender={(option) => (
                          <>
                            <span>{option.label}</span>
                          </>
                        )}
                        onChange={(value) =>
                          props.setFieldValue("groups", value)
                        }
                      />
                    </FloatLabel>
                  </div>
                </>
              )}
              <div className="col-span-12 flex items-center justify-center ">
                <Button
                  htmlType="submit"
                  icon={id ? <MdEdit /> : <CiSaveDown1 />}
                  size="middle"
                  className={`${
                    id
                      ? "bg-orange-500 border-2 border-orange-400 hover:bg-orange-400 active:bg-orange-300"
                      : "bg-green-500 border-2 border-green-400 hover:bg-green-600 active:bg-green-400"
                  } text-white w-full`}
                  loading={isLoading || updateLoading || createLoading}
                >
                  Guardar
                </Button>
              </div>
            </div>
          </form>
        );
      }}
    </Formik>
  );
}
