import ProfileForm from "@/Features/Profile/Components/ProfileForm";
import useUser from "@/hooks/userHooks";
import { IUser } from "@/interfaces/IUser";
import { useAppSelector } from "@/stores/hooks";
import { getColorByRole, getUservatarUrl } from "@/utils/getUserAvatarImage";
import {
  Avatar,
  Badge,
  Button,
  Modal,
  Popconfirm,
  Table,
  TableColumnsType,
} from "antd";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline, MdEdit } from "react-icons/md";

interface DataType extends IUser {
  key: React.Key;
}

export default function DataTable() {
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    userId?: number;
  }>({
    isOpen: false,
    userId: undefined,
  });
  const { fetchUsers, fetchLoading, refetchAll } = useUser();
  const users = useAppSelector((state) => state.users.users);

  useEffect(() => {
    refetchAll();
  }, [refetchAll]);
  useEffect(() => {
    fetchUsers();
  }, [fetchLoading]);

  const handleEditModal = (id: number) => {
    setEditModal({
      isOpen: true,
      userId: id,
    });
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "Nombre",
      dataIndex: "first_name",
      render: (_, record) => {
        const avatarUrl = getUservatarUrl(record.avatar ?? undefined);

        return (
          <>
            <div className="flex items-center justify-start gap-2">
              <Avatar src={avatarUrl} alt="User Image" />
              <span>{record.first_name}</span>
            </div>
          </>
        );
      },
    },
    { title: "Apellido", dataIndex: "last_name" },
    { title: "Correo", dataIndex: "email" },
    { title: "Cedula", dataIndex: "cedula" },
    {
      title: "Roles",
      render: (_, record) => (
        <>
          <div className="flex flex-wrap flex-col items-start justify-center gap-2">
            {record.groups_detail.map((role) => (
              <Badge
                key={role.id}
                count={role.name}
                color={getColorByRole(role.name).hex}
              />
            ))}
          </div>
        </>
      ),
    },
    {
      title: "Acciones",
      key: "Operation",
      width: 1,
      render: (_, record) => {
        return (
          <>
            <div className=" flex items-center justify-start gap-2">
              <Button
                icon={<CiEdit />}
                onClick={() => handleEditModal(record.id)}
              />
              <Popconfirm
                title="Eliminar Empresa"
                description="Estas seguro de eliminar esta empresa?"
                //   onConfirm={async () => await confirm(record.id)}
                onCancel={() => null}
                okText="Eliminar"
                cancelText="No"
              >
                <Button danger icon={<MdDeleteOutline />} />
              </Popconfirm>
            </div>
          </>
        );
      },
    },
  ];

  const dataSource = users.map((user: IUser) => ({
    ...user,
    key: user.id, // Utilizando el ID como clave única
  }));

  return (
    <>
      <Table
        size="small"
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: "max-content" }}
        showSorterTooltip={{ target: "sorter-icon" }}
        loading={fetchLoading}
        //@ts-ignore
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "50", "100"],
        }}
      />

      <Modal
        title={
          <span className="flex items-center justify-start">
            {" "}
            <MdEdit className="mr-2" />
            Editar Usuario
          </span>
        }
        centered
        open={editModal.isOpen}
        onCancel={() => setEditModal({ isOpen: false, userId: 0 })}
        // width={1000}
        footer={null}
      >
        <ProfileForm id={editModal.userId} />
      </Modal>
    </>
  );
}
