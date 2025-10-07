import { useSearchParams } from "react-router-dom";
import MainLayout from "../../../components/layout/MainLayout";
import Memo from "./memo/Memo";
import Report from "./report/Report";
import { Tabs } from "antd";
import FormMemo from "./memo/FormMemo";

const TahfizMemo = () => {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");
  const userid = searchParams.get("studentid");
  const name = searchParams.get("name");

  const items = [
    { label: "Setor Hafalan", key: "1", children: <Memo /> },
    { label: "Laporan", key: "2", children: <Report /> },
  ];

  if (view === "form") {
    return (
      <MainLayout title={"Hafalan Tahfiz"} levels={["tahfiz"]}>
        <FormMemo name={name} userid={userid} />
      </MainLayout>
    );
  }

  return (
    <MainLayout title={"Hafalan Tahfiz"} levels={["tahfiz"]}>
      <Tabs defaultActiveKey='1' centered items={items} />
    </MainLayout>
  );
};

export default TahfizMemo;
