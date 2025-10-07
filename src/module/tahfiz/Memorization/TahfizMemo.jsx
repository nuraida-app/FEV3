import React from "react";
import MainLayout from "../../../components/layout/MainLayout";
import Memo from "./memo/Memo";
import Report from "./report/Report";
import { Tabs } from "antd";

const TahfizMemo = () => {
  const items = [
    { label: "Setor Hafalan", key: "1", children: <Memo /> },
    { label: "Laporan", key: "2", children: <Report /> },
  ];

  return (
    <MainLayout title={"Hafalan Tahfiz"} levels={["tahfiz"]}>
      <Tabs defaultActiveKey="1" centered items={items} />
    </MainLayout>
  );
};

export default TahfizMemo;
