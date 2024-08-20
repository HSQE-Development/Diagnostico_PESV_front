import { Pagination } from "antd";
import React from "react";
import CompanyCards from "./CompanyCards";

export default function CompanyList() {
  return (
    <>
      <div className="flex flex-col">
        <CompanyCards />
        <Pagination
          align="center"
          total={85}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
          defaultPageSize={20}
          defaultCurrent={1}
        />
      </div>
    </>
  );
}
