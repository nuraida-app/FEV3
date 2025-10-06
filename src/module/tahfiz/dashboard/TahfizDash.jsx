import {
  Card,
  Col,
  Progress,
  Row,
  Spin,
  Statistic,
  Table,
  Tabs,
  Select,
} from "antd";
import { useState, useEffect } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import { useGetAchievementQuery } from "../../../service/api/tahfiz/ApiReport";

const { Option } = Select;

const TahfizDash = () => {
  const { data, isLoading } = useGetAchievementQuery();
  const [selectedDataIndex, setSelectedDataIndex] = useState(0);

  if (isLoading) {
    return (
      <MainLayout title={"Dashboard"} levels={["tahfiz"]}>
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Spin size='large' />
        </div>
      </MainLayout>
    );
  }

  // Menangani jika data kosong atau tidak ada
  if (!data || data.length === 0) {
    return (
      <MainLayout title={"Dashboard"} levels={["tahfiz"]}>
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          Data tidak ditemukan.
        </div>
      </MainLayout>
    );
  }

  const selectedData = data[selectedDataIndex];

  const handleDataChange = (value) => {
    setSelectedDataIndex(value);
  };

  const gradeTabs =
    selectedData?.grade.map((grade) => {
      const classColumns = [
        {
          title: "Kelas",
          dataIndex: "class_name",
          key: "class_name",
        },
        {
          title: "Selesai",
          dataIndex: "completed",
          key: "completed",
        },
        {
          title: "Belum Selesai",
          dataIndex: "uncompleted",
          key: "uncompleted",
        },
        {
          title: "Melampaui Target (Selesai)",
          dataIndex: "exceed_completed",
          key: "exceed_completed",
        },
        {
          title: "Melampaui Target (Belum Selesai)",
          dataIndex: "exceed_uncompleted",
          key: "exceed_uncompleted",
        },
      ];

      const studentColumns = [
        {
          title: "NIS",
          dataIndex: "nis",
          key: "nis",
        },
        {
          title: "Nama",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Progress Target",
          key: "progress",
          render: (text, record) => (
            <>
              {record.progress.map((prog, index) => (
                <div key={index}>
                  <span>{prog.juz}: </span>
                  <Progress percent={prog.persentase} size='small' />
                </div>
              ))}
            </>
          ),
        },
        {
          title: "Progress Melampaui Target",
          key: "exceed",
          render: (text, record) => (
            <>
              {record.exceed.map((exc, index) => (
                <div key={index}>
                  <span>{exc.juz}: </span>
                  <Progress
                    percent={exc.persentase}
                    size='small'
                    status='success'
                  />
                </div>
              ))}
            </>
          ),
        },
      ];

      return {
        key: grade.id,
        label: `Kelas ${grade.name}`,
        children: (
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Row gutter={16}>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title='Pencapaian Rata-rata'
                      value={grade.achievement}
                      precision={2}
                      suffix='%'
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title='Selesai'
                      value={grade.completed}
                      valueStyle={{ color: "#3f8600" }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title='Belum Selesai'
                      value={grade.uncompleted}
                      valueStyle={{ color: "#cf1322" }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title='Melampaui Target'
                      value={grade.exceed_completed}
                    />
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Table
                columns={classColumns}
                dataSource={grade.classes}
                rowKey='class_id'
                expandable={{
                  expandedRowRender: (record) => (
                    <Table
                      columns={studentColumns}
                      dataSource={record.students}
                      rowKey='userid'
                      pagination={false}
                    />
                  ),
                }}
              />
            </Col>
          </Row>
        ),
      };
    }) || [];

  return (
    <MainLayout title={"Dashboard"} levels={["tahfiz"]}>
      <Card
        title={`Dashboard Tahfiz - Periode ${selectedData?.periode}`}
        style={{ marginBottom: "24px" }}
        extra={
          <Select
            defaultValue={0}
            style={{ width: 200 }}
            onChange={handleDataChange}
          >
            {data.map((item, index) => (
              <Option key={item.homebase_id} value={index}>
                {item.homebase}
              </Option>
            ))}
          </Select>
        }
      >
        {/* Konten Card utama bisa dikosongkan atau diisi info tambahan */}
        <Tabs defaultActiveKey='1' items={gradeTabs} />
      </Card>
    </MainLayout>
  );
};

export default TahfizDash;
