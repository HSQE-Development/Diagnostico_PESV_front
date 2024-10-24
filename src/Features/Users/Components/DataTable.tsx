import ProfileForm from "@/Features/Profile/Components/ProfileForm";
import useUser from "@/hooks/userHooks";
import { IUser } from "@/interfaces/IUser";
import { useAppSelector } from "@/stores/hooks";
import { userService } from "@/stores/services/userService";
import { getColorByRole, getUservatarUrl } from "@/utils/getUserAvatarImage";
import { Avatar, Badge, Button, Modal, Table, TableColumnsType } from "antd";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdEdit } from "react-icons/md";

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
  const { fetchUsers } = useUser();

  const {
    data: usersData,
    isLoading: fetchLoading,
    isFetching,
  } = userService.useFindAllQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  useEffect(() => {
    if (usersData) fetchUsers(usersData);
  }, [usersData]);

  const users = useAppSelector((state) => state.users.users) || [];

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
      width: 10,
      render: (_, record) => {
        const avatarUrl = getUservatarUrl(record.avatar ?? undefined);

        return (
          <>
            <div className="flex items-center justify-start gap-2">
              <Avatar src={avatarUrl} alt="User Image" />
              <div className="flex flex-col justify-start items-start">
                <h2 className="font-semibold">
                  {record.first_name} {record.last_name}
                </h2>
                <p className="text-zinc-500">{record.email}</p>
              </div>
            </div>
          </>
        );
      },
    },
    { title: "Cedula", dataIndex: "cedula", width: 5 },
    {
      title: "Roles",
      width: 5,
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
            </div>
          </>
        );
      },
    },
  ];

  const dataSource = (users ?? []).map((user: IUser) => ({
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
        loading={fetchLoading || isFetching}
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
