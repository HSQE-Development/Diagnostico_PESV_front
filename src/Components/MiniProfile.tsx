import { useCorporate } from "@/context/CorporateGroupContext";
import { Group } from "@/interfaces/Group";
import { clearAuthUser } from "@/stores/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { authService } from "@/stores/services/authService";
import { diagnosisService } from "@/stores/services/diagnosisServices";
import { getUservatarUrl } from "@/utils/getUserAvatarImage";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  Dropdown,
  MenuProps,
  notification,
} from "antd";
import React, { useEffect } from "react";
import { IoIosNotifications } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import NotificationList from "./NotificationList";
import { useModal } from "@/hooks/utilsHooks";
import {
  setDiagnosisNotification,
  setDiagnosisNotifications,
} from "@/stores/features/diagnosisSlice";
import { Notification } from "@/interfaces/Notification";

interface MiniProfileProps {
  username: string;
  cargo: Group[];
  avatar?: string;
}

export default function MiniProfile({
  username,
  cargo,
  avatar,
}: MiniProfileProps) {
  const { isExternal: is_external_company } = useCorporate();
  const { isOpen, open, close } = useModal();
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.authUser);
  const [logout] = authService.useLogoutMutation();
  const handleLogout = async () => {
    await logout({
      refresh: authUser?.tokens.refresh ?? "",
    }).unwrap();
    dispatch(clearAuthUser());
    navigate("/login");
  };
  const [readNotifications] = diagnosisService.useReadNotificationsMutation();

  //WEBSOCKET
  useEffect(() => {
    const socket = new WebSocket(
      `${import.meta.env.VITE_PUBLIC_WEBSOCKET_URL}/diagnosis/`
    );
    socket.onopen = () => {
      //("Conexion exitosa");
    };

    const handleMessage = (diagnosis: any) => {
      const data = JSON.parse(diagnosis.data);
      if (data.type === "external_count") {
        // //(diagnosisData);
      }
      if (data.type === "external_notification") {
        const notificationData: Notification = data.notification_data;
        dispatch(setDiagnosisNotification(notificationData));
        api.info({
          message: notificationData.message,
          duration: 5,
          closable: true,
          showProgress: true,
        });
      }
    };
    socket.onmessage = handleMessage;

    return () => {
      socket.close();
    };
  }, [dispatch, api]);

  const {
    data: notificationsData,
    isLoading: notificationsLoading,
    refetch: notificationsRefetch,
  } = diagnosisService.useFindNotificationsByUserQuery(
    authUser ? { user: authUser.user.id } : skipToken
  );

  useEffect(() => {
    notificationsRefetch();
  }, [notificationsRefetch, dispatch]);

  useEffect(() => {
    if (notificationsData) {
      dispatch(setDiagnosisNotifications(notificationsData));
    }
  }, [notificationsData, dispatch]);

  const diagnosis_notifications = useAppSelector(
    (state) => state.diagnosis.diagnosis_notifications
  );

  const items: MenuProps["items"] = [
    {
      label: "Perfil",
      key: "1",
      onClick: () => navigate("/app/my_profile"),
      className: `${is_external_company ? "hidden" : ""}`,
    },
    {
      label: "Cerrar Sesión",
      key: "2",
      onClick: () => handleLogout(),
    },
  ];
  const avatarUrl = getUservatarUrl(avatar ?? undefined);
  const notificationNoRead = diagnosis_notifications.filter(
    (notification) => !notification.read
  );

  const handleReadNotificationsOnCloseDrawer = async () => {
    const notifications_ids = diagnosis_notifications.map(
      (notify) => notify.id
    );
    await readNotifications({
      notifications: notifications_ids,
    }).unwrap();
  };

  return (
    <>
      {contextHolder}
      <div className="flex justify-evenly items-center gap-x-2 transition-all">
        <div className="flex flex-col items-end transition-all">
          <span className="text-sm">{username}</span>
          <div className="items-center justify-evenly gap-2 hidden sm:flex transition-all">
            {cargo.map((role) => (
              <Badge key={role.id} text={role.name} showZero color="#85CDFA" />
            ))}
          </div>
        </div>
        {/* <Avatar src={<img src={url} alt="avatar" />} /> */}
        <Dropdown
          menu={{ items }}
          placement="bottomLeft"
          arrow={{ pointAtCenter: true }}
        >
          <Avatar src={avatarUrl} alt="User Image" />
          {/* <Button>bottom</Button> */}
        </Dropdown>
        <Drawer
          title="Notificaciones"
          placement={"right"}
          closable={true}
          onClose={() => {
            close();
            handleReadNotificationsOnCloseDrawer();
          }}
          open={isOpen}
          key={"right"}
          className="rounded-xl "
        >
          <NotificationList
            notifications={diagnosis_notifications}
            close={close}
          />
        </Drawer>
        <Badge count={notificationNoRead?.length}>
          <Button
            icon={<IoIosNotifications />}
            className="text-2xl text-zinc-500"
            type="text"
            loading={notificationsLoading}
            onClick={open}
          ></Button>
        </Badge>
      </div>
    </>
  );
}
