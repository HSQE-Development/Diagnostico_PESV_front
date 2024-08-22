import { Skeleton } from "antd";
import React from "react";

export default function MiniProfilePreload() {
  return (
    <div className="flex items-center justify-evenly">
      <div className="flex flex-col gap-2 mr-2 items-end">
        <Skeleton.Button active size="small" className="w-32 h-4" />
        <Skeleton.Button active size="small" className="w-40 h-4" />
      </div>
      <Skeleton.Avatar active />
    </div>
  );
}
