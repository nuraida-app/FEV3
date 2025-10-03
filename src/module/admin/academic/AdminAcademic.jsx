import { Flex, Tabs } from "antd";
import MainLayout from "../../../components/layout/MainLayout";
import Subjects from "./subjects/Subjects";
import Teachers from "./teachers/Teachers";
import Classification from "./classification/Classification";
import Report from "./report/Report";

const AdminAcademic = () => {
  const items = [
    { label: "Klasifikasi", key: "1", children: <Classification /> },
    { label: "Mata Pelajaran", key: "2", children: <Subjects /> },
    { label: "Guru", key: "3", children: <Teachers /> },
    { label: "Laporan Bulanan", key: "4", children: <Report /> },
  ];

  return (
    <MainLayout title={"Management Akademik"} levels={["admin"]}>
      <Flex vertical gap={"middle"}>
        <Tabs defaultActiveKey="1" centered items={items} />
      </Flex>
    </MainLayout>
  );
};

export default AdminAcademic;
