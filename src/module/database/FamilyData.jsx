import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Space,
  Popconfirm,
  message,
  Card,
  Typography,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;

const FamilyData = ({ familyData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const showModal = (record = null) => {
    setEditingRecord(record);
    form.setFieldsValue(
      record ? { ...record, birth_date: dayjs(record.birth_date) } : {}
    );
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    if (editingRecord) {
      console.log("Update data:", { ...editingRecord, ...values });
      message.success("Data anggota keluarga berhasil diperbarui");
    } else {
      console.log("Tambah data baru:", values);
      message.success("Anggota keluarga baru berhasil ditambahkan");
    }
    handleCancel();
  };

  const handleDelete = (id) => {
    console.log("Hapus data dengan id:", id);
    message.success("Data anggota keluarga berhasil dihapus");
  };

  const columns = [
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Jenis Kelamin",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => (gender === "P" ? "Perempuan" : "Laki-laki"),
    },
    {
      title: "Tanggal Lahir",
      dataIndex: "birth_date",
      key: "birth_date",
      render: (date) => dayjs(date).format("DD MMMM YYYY"),
    },
    {
      title: "Aksi",
      key: "action",
      render: (_, record) => (
        <Space size='middle'>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title='Yakin ingin menghapus?'
            onConfirm={() => handleDelete(record.id)}
            okText='Ya'
            cancelText='Tidak'
          >
            <Button icon={<DeleteOutlined />} danger>
              Hapus
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={<Title level={5}>Anggota Keluarga yang Tinggal Serumah</Title>}
    >
      <Button
        type='primary'
        icon={<PlusOutlined />}
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        Tambah Anggota Keluarga
      </Button>
      <Table
        columns={columns}
        dataSource={familyData}
        rowKey='id'
        scroll={{ x: true }} // Agar tabel bisa di-scroll di layar kecil
      />
      <Modal
        title={
          editingRecord ? "Edit Anggota Keluarga" : "Tambah Anggota Keluarga"
        }
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText='Simpan'
        cancelText='Batal'
      >
        <Form form={form} layout='vertical' onFinish={onFinish}>
          <Form.Item name='name' label='Nama' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name='gender'
            label='Jenis Kelamin'
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "L", label: "Laki-laki" },
                { value: "P", label: "Perempuan" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name='birth_date'
            label='Tanggal Lahir'
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default FamilyData;
