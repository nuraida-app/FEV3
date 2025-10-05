import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Row,
  DatePicker,
  message,
  Typography,
} from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;

// Komponen generik untuk menampilkan data satu orang tua
const ParentInfo = ({ title, parentData, prefix }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (parentData) {
      form.setFieldsValue({
        [`${prefix}_name`]: parentData[`${prefix}_name`],
        [`${prefix}_nik`]: parentData[`${prefix}_nik`],
        [`${prefix}_birth_place`]: parentData[`${prefix}_birth_place`],
        [`${prefix}_birth_date`]: parentData[`${prefix}_birth_date`]
          ? dayjs(parentData[`${prefix}_birth_date`])
          : null,
        [`${prefix}_job`]: parentData[`${prefix}_job`],
        [`${prefix}_phone`]: parentData[`${prefix}_phone`],
      });
    }
  }, [parentData, form, prefix]);

  const onFinish = (values) => {
    console.log(`Data ${title} yang akan disimpan:`, values);
    message.success(`Data ${title} berhasil diperbarui!`);
    setIsEditing(false);
  };

  return (
    <Card
      style={{ marginBottom: "16px" }}
      title={<Title level={5}>{title}</Title>}
      extra={
        isEditing ? (
          <div>
            <Button
              icon={<SaveOutlined />}
              type='primary'
              onClick={() => form.submit()}
              style={{ marginRight: 8 }}
            >
              Simpan
            </Button>
            <Button
              icon={<CloseOutlined />}
              onClick={() => setIsEditing(false)}
            >
              Batal
            </Button>
          </div>
        ) : (
          <Button
            icon={<EditOutlined />}
            type='primary'
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )
      }
    >
      {isEditing ? (
        <Form form={form} layout='vertical' onFinish={onFinish}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name={`${prefix}_name`} label='Nama'>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name={`${prefix}_nik`} label='NIK'>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name={`${prefix}_birth_place`} label='Tempat Lahir'>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name={`${prefix}_birth_date`} label='Tanggal Lahir'>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name={`${prefix}_job`} label='Pekerjaan'>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name={`${prefix}_phone`} label='No. Telepon'>
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ) : (
        <Descriptions bordered column={1} layout='vertical'>
          <Descriptions.Item label='Nama'>
            {parentData?.[`${prefix}_name`]}
          </Descriptions.Item>
          <Descriptions.Item label='NIK'>
            {parentData?.[`${prefix}_nik`]}
          </Descriptions.Item>
          <Descriptions.Item label='TTL'>
            {`${parentData?.[`${prefix}_birth_place`]}, ${dayjs(
              parentData?.[`${prefix}_birth_date`]
            ).format("DD MMMM YYYY")}`}
          </Descriptions.Item>
          <Descriptions.Item label='Pekerjaan'>
            {parentData?.[`${prefix}_job`]}
          </Descriptions.Item>
          <Descriptions.Item label='No. Telepon'>
            {parentData?.[`${prefix}_phone`]}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Card>
  );
};

const ParentData = ({ studentData }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <ParentInfo
          title='Data Ayah'
          parentData={studentData}
          prefix='father'
        />
      </Col>
      <Col xs={24} lg={12}>
        <ParentInfo title='Data Ibu' parentData={studentData} prefix='mother' />
      </Col>
    </Row>
  );
};

export default ParentData;
