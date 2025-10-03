import { FileTextOutlined, SettingOutlined } from "@ant-design/icons";
import { Card, Col, Flex, Row, Tooltip, Typography } from "antd";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const { Meta } = Card;

const Scoring = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);

  const subjectsData = user?.subjects;

  const handleSelect = (item) => {
    setSearchParams({
      mode: "scoring",
      name: item.name?.replace(/\s+/g, "-"),
      subjectid: item.id,
    });
  };

  return (
    <Flex vertical gap="middle">
      <Typography.Title level={5}>
        Pilih Mata Pelajaran Untuk Penilaian
      </Typography.Title>

      <Row gutter={[16, 16]}>
        {subjectsData?.map((item) => (
          <Col key={item.id} sm={24} md={12} lg={6}>
            <Card
              hoverable
              cover={
                <img
                  src={item.cover ? item.cover : "/logo.png"}
                  alt={item.name}
                />
              }
              actions={[
                <Tooltip title="Penilaian" key={"scoring"}>
                  <FileTextOutlined onClick={() => handleSelect(item)} />
                </Tooltip>,
                <Tooltip title="Pembobotan" key={"setting"}>
                  <SettingOutlined />
                </Tooltip>,
              ]}
            >
              <Meta title={item.name} />
            </Card>
          </Col>
        ))}
      </Row>
    </Flex>
  );
};

export default Scoring;
