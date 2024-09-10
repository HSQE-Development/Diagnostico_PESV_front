import { Notification } from "@/interfaces/Notification";
import { encryptId, getColorByLevelPesv, timeAgo } from "@/utils/utilsMethods";
import { Button, Tag } from "antd";
import React from "react";
import { GrFormNextLink } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

type NotificationCardProps = {
  notification: Notification;
  close?: () => void;
};
function NotificationCard({ notification, close }: NotificationCardProps) {
  const navigate = useNavigate();
  return (
    <>
      <div className="border rounded-xl w-full flex flex-col overflow-hidden justify-between items-center">
        <div className="p-2 flex flex-col">
          <div className="w-full flex items-center justify-between flex-wrap">
            <span className="font-semibold">
              {notification.diagnosis_detail.company_detail.name.toUpperCase()}
            </span>
            {!notification.read && <Tag color="#76a4ff" className="p-1"></Tag>}
          </div>
          <div className="flex flex-col items-start">
            {notification.message}
            <small
              className={` ${
                getColorByLevelPesv(
                  notification.diagnosis_detail.type_detail?.id ?? 0
                ).tailwind
              } px-2 rounded-md text-white  block`}
            >
              {notification.diagnosis_detail.type_detail?.name.toUpperCase()}
            </small>
          </div>
          <small className="text-end">
            {timeAgo(new Date(notification.created_at))}
          </small>
        </div>
        <Button
          className="w-full rounded-none bg-zinc-700 hover:bg-zinc-800 active:bg-black border-white text-white"
          icon={<GrFormNextLink />}
          iconPosition="end"
          onClick={() => {
            navigate(
              `/app/companies/diagnosis/${encryptId(
                notification.diagnosis_detail.company_detail.id.toString()
              )}?diagnosis=${encryptId(
                notification.diagnosis_detail.id.toString()
              )}`
            );
            close?.();
          }}
        >
          Ir al diagnostico
        </Button>
      </div>
    </>
  );
}

type NotificationListProps = {
  notifications: Notification[] | [];
  close?: () => void;
};
export default function NotificationList({
  notifications,
  close,
}: NotificationListProps) {
  return (
    <>
      <div className="w-full flex flex-col justify-start items-stretch gap-2">
        {notifications.map((notification) => (
          <NotificationCard
            notification={notification}
            key={notification.id}
            close={close}
          />
        ))}
      </div>
    </>
  );
}
