import React, { useState, useEffect } from "react";
import {
  Flex,
  Select,
  Typography,
  Card,
  Empty,
  Spin,
  Alert,
  Collapse,
  List,
  Tag,
  Divider,
  Descriptions,
  Statistic,
  Row,
  Col,
  Grid,
  Form,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ReadOutlined,
  HomeOutlined,
  TeamOutlined,
  RiseOutlined,
  FallOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useGetMonthlyRecapQuery } from "../../../../service/api/lms/ApiRecap";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { useBreakpoint } = Grid;

const SubjectDetail = ({ detail }) => {
  // Pastikan detail adalah array dan memiliki panjang yang cukup
  const attendanceDetail = detail?.[0]?.attendance || [];
  const attitudeDetail = detail?.[1]?.attitude || [];
  const assessmentDetail = detail?.[2] || { summative: [], formative: [] };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12} lg={6}>
        <Card size="small" title="Attendance">
          <List
            dataSource={attendanceDetail}
            renderItem={(item) => {
              const key = Object.keys(item)[0];
              const value = item[key];
              return (
                <List.Item>
                  <Text style={{ textTransform: "capitalize" }}>{key}</Text>
                  <Text strong>
                    {key === "presentase" ? `${value}%` : value}
                  </Text>
                </List.Item>
              );
            }}
          />
        </Card>
      </Col>
      <Col xs={24} md={12} lg={6}>
        <Card size="small" title="Attitude">
          <List
            dataSource={attitudeDetail}
            renderItem={(item) => {
              const key = Object.keys(item)[0];
              const value = item[key];
              return (
                <List.Item>
                  <Text style={{ textTransform: "capitalize" }}>{key}</Text>
                  <Statistic
                    value={value}
                    precision={2}
                    valueStyle={{ fontSize: "1rem" }}
                  />
                </List.Item>
              );
            }}
          />
        </Card>
      </Col>
      <Col xs={24} md={12} lg={8}>
        <Card size="small" title="Summative">
          <List
            dataSource={assessmentDetail.summative}
            renderItem={(item) => {
              const key = Object.keys(item)[0];
              const value = item[key];
              return (
                <List.Item>
                  <Text style={{ textTransform: "capitalize" }}>{key}</Text>
                  <Statistic
                    value={value}
                    precision={2}
                    valueStyle={{ fontSize: "1rem" }}
                  />
                </List.Item>
              );
            }}
          />
        </Card>
      </Col>
      <Col xs={24} md={12} lg={4}>
        <Card size="small" title="Formative">
          <List
            dataSource={assessmentDetail.formative}
            renderItem={(item) => <List.Item>{item}</List.Item>}
            locale={{ emptyText: "-" }}
          />
        </Card>
      </Col>
    </Row>
  );
};

const Monthly = () => {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const monthOpts = months.map((month) => ({ label: month, value: month }));

  const [month, setMonth] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  const studentId = user?.student_id;
  const periode = user?.periode;

  useEffect(() => {
    const today = new Date();
    const currentMonthIndex = today.getMonth();
    // Default ke bulan sebelumnya, atau Desember jika bulan ini Januari
    const previousMonthName =
      months[currentMonthIndex === 0 ? 11 : currentMonthIndex - 1];
    setMonth(previousMonthName);
    form.setFieldsValue({ month: previousMonthName });
  }, [user, form]);

  const { data, error, isFetching } = useGetMonthlyRecapQuery(
    { studentId, month, periode },
    { skip: !studentId || !month || !periode }
  );

  const screens = useBreakpoint();
  const recapData = data?.[0];

  const renderSubjectList = (subjects) => (
    <List
      itemLayout="vertical"
      dataSource={subjects}
      renderItem={(subject) => (
        <List.Item key={`${subject.name}-${subject.teacher}`}>
          <Card bordered={false}>
            <Flex
              justify="space-between"
              align="center"
              wrap="wrap"
              gap="small"
            >
              <div>
                <Title level={5} style={{ marginBottom: 0 }}>
                  {subject.name}
                </Title>
                <Text type="secondary">
                  <UserOutlined /> Guru: {subject.teacher}
                </Text>
              </div>
              <Statistic
                title="Skor Akhir"
                value={subject.score}
                precision={2}
                valueStyle={{
                  color: subject.score >= 75 ? "#3f8600" : "#cf1322",
                }}
                prefix={
                  subject.score >= 75 ? <RiseOutlined /> : <FallOutlined />
                }
              />
            </Flex>

            {subject.chapters && subject.chapters.length > 0 && (
              <>
                <Divider orientation="left" plain>
                  <BookOutlined /> Chapter Bulan Ini
                </Divider>
                <List
                  size="small"
                  dataSource={subject.chapters}
                  renderItem={(chapter) => (
                    <List.Item>{chapter.name}</List.Item>
                  )}
                />
              </>
            )}

            <Divider orientation="left" plain>
              Detail Penilaian
            </Divider>
            <SubjectDetail detail={subject.detail} />

            {subject.note && (
              <>
                <Divider orientation="left" plain>
                  Catatan Guru
                </Divider>
                <Paragraph italic>"{subject.note}"</Paragraph>
              </>
            )}
          </Card>
        </List.Item>
      )}
    />
  );

  return (
    <Flex vertical gap="large">
      <Card>
        <Form form={form} layout="vertical">
          <Form.Item
            name="month"
            label={
              <Title level={4} style={{ margin: 0 }}>
                Pilih Bulan Laporan
              </Title>
            }
          >
            <Select
              placeholder="Pilih Bulan"
              onChange={(value) => setMonth(value)}
              options={monthOpts}
            />
          </Form.Item>
        </Form>
      </Card>

      {isFetching && (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" />
        </div>
      )}
      {error && (
        <Alert
          message="Terjadi Kesalahan"
          description={error?.data?.message || "Gagal memuat data."}
          type="error"
          showIcon
        />
      )}
      {!isFetching && recapData && (
        <Card>
          <Descriptions bordered column={screens.md ? 2 : 1} size="small">
            <Descriptions.Item
              label={
                <>
                  <UserOutlined /> Nama Siswa
                </>
              }
              span={2}
            >
              <Text strong>
                {recapData.name} ({recapData.nis})
              </Text>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <HomeOutlined /> Homebase
                </>
              }
            >
              {recapData.homebase}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <ReadOutlined /> Kelas
                </>
              }
            >
              {recapData.grade} - {recapData.class}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <TeamOutlined /> Wali Kelas
                </>
              }
            >
              {recapData.teacher_homeroom}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  <CalendarOutlined /> Periode Laporan
                </>
              }
            >
              <Text strong>
                {recapData.periode} - {recapData.month}
              </Text>
            </Descriptions.Item>
          </Descriptions>
          <Divider />
          <Collapse accordion defaultActiveKey={["0"]} ghost>
            {recapData.category.map((cat, index) => (
              <Panel header={<Title level={5}>{cat.name}</Title>} key={index}>
                {cat.name === "Diniyah" && cat.branch ? (
                  <Collapse>
                    {cat.branch.map((branch, branchIndex) => (
                      <Panel
                        header={
                          <Flex
                            justify="space-between"
                            style={{ width: "100%" }}
                          >
                            <Text strong>{branch.name}</Text>
                            <Tag color="blue">
                              Rata-rata Skor: {branch.score}
                            </Tag>
                          </Flex>
                        }
                        key={branchIndex}
                      >
                        {renderSubjectList(branch.subjects)}
                      </Panel>
                    ))}
                  </Collapse>
                ) : (
                  renderSubjectList(cat.subjects)
                )}
              </Panel>
            ))}
          </Collapse>
        </Card>
      )}
      {!isFetching && !recapData && month && !error && (
        <Card>
          <Empty description="Data laporan untuk bulan yang dipilih tidak tersedia." />
        </Card>
      )}
    </Flex>
  );
};

export default Monthly;
