import React from "react";
import clsx from "clsx";
interface HeaderTitleProps {
  title: string;
  icon: React.ReactElement;
  subTitle: string;
  isGrid?: boolean;
}

function HeaderTitle({
  title,
  icon,
  subTitle,
  isGrid = false,
}: HeaderTitleProps) {
  return (
    <div
      className={clsx(
        "flex items-center justify-start p-2 bg-blue-100 rounded-md w-full transition-all",
        {
          "md:w-2/4 lg:w-1/3": !isGrid,
        }
      )}
    >
      <div className="text-blue-500 text-2xl border-l-2 border-blue-500 pl-2">
        {icon}
      </div>
      <div className="flex flex-col  ml-2">
        <span className="text-black font-bold">{title}</span>
        <small className="text-slate-400">{subTitle}</small>
      </div>
    </div>
  );
}

export default React.memo(HeaderTitle);
