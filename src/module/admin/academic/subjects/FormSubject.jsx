import { Modal, message, Form, Input, Upload, Button, Select } from "antd";
import {
  useAddSubjectMutation,
  useGetBranchesQuery,
  useGetCategoriesQuery,
} from "../../../../service/api/main/ApiSubject";
import { useEffect, useState } from "react";
// PERBAIKAN 2: Impor ikon yang dibutuhkan
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";

const page = "";
const limit = "";
const search = "";

const FormSubject = ({ open, onClose, title, subject }) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [addSubject, { data, isLoading, isSuccess, error, reset }] =
    useAddSubjectMutation();

  const { data: categories, isLoading: catsLoading } = useGetCategoriesQuery({
    page,
    limit,
    search,
  });
  const { data: braches, isLoading: branchesLoading } = useGetBranchesQuery({
    page,
    limit,
    search,
  });

  const catsOpts =
    categories?.map((item) => ({
      value: item.id,
      label: item.name,
    })) || [];
  const branchesOpts =
    braches?.map((item) => ({
      value: item.id,
      label: item.name,
    })) || [];

  useEffect(() => {
    if (open) {
      form.resetFields();
      setFile(null); // Selalu reset file state

      if (subject) {
        form.setFieldsValue({
          name: subject.name,
          // PERBAIKAN: Set value untuk Select dengan format { value, label }
          categoryid: {
            value: subject.category_id,
            label: subject.category_name,
          },
          branchid: { value: subject.branch_id, label: subject.branch_name },
        });
        setImageUrl(subject.cover || null);
      } else {
        form.resetFields();
        setImageUrl(null);
      }
    }
  }, [subject, form, open]);

  // Asumsi `subject` object memiliki `category_name` dan `branch_name`
  // Jika tidak, Anda perlu fetch data detailnya atau sesuaikan.

  useEffect(() => {
    if (isSuccess) {
      message.success(data.message);
      onClose();
      reset();
    }
    if (error) {
      message.error(error?.data?.message || "Terjadi kesalahan");
      reset(); // Reset state error agar tidak muncul lagi
    }
  }, [isSuccess, error, data, onClose, reset]);

  // PERBAIKAN 1: Logika handleSubmit diperbaiki
  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append("name", values.name);

    // Pastikan nilai ada sebelum di-append
    if (values.categoryid) {
      formData.append("categoryid", values.categoryid.value);
    }
    if (values.branchid) {
      formData.append("branchid", values.branchid.value);
    }

    if (file) {
      formData.append("cover", file);
    }

    if (subject) {
      formData.append("id", subject.id);
    }

    addSubject(formData);
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Anda hanya bisa mengunggah file gambar!");
      } else {
        setFile(file);
        setImageUrl(URL.createObjectURL(file));
      }
      return false; // Selalu return false untuk mencegah upload otomatis
    },
    onRemove: () => {
      setFile(null);
      setImageUrl(subject ? subject.cover : null);
    },
    showUploadList: false,
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      destroyOnHidden
      okText="Simpan"
      cancelText="Tutup"
      confirmLoading={isLoading}
      loading={isLoading}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 24 }}
      >
        <Form.Item
          name="categoryid"
          label="Pilih Kategori"
          rules={[{ required: true, message: "Kategori wajib dipilih" }]}
        >
          <Select
            allowClear
            placeholder="Pilih Kategori"
            options={catsOpts}
            loading={catsLoading}
            labelInValue
            showSearch
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            virtual={false}
          />
        </Form.Item>

        <Form.Item name="branchid" label="Pilih Rumpun">
          <Select
            allowClear
            placeholder="Pilih Rumpun"
            options={branchesOpts}
            loading={branchesLoading}
            labelInValue
            showSearch
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            virtual={false}
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="Nama Pelajaran"
          rules={[
            { required: true, message: "Nama pelajaran tidak boleh kosong!" },
          ]}
        >
          <Input placeholder="Contoh: Matematika" />
        </Form.Item>

        {/* PERBAIKAN 2: UI Upload yang lebih modern */}
        <Form.Item label="Cover Gambar">
          <Upload.Dragger {...uploadProps}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "180px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Klik atau seret file ke area ini
                </p>
                <p className="ant-upload-hint">
                  Gunakan gambar yang menarik sebagai cover.
                </p>
              </>
            )}
          </Upload.Dragger>
          {imageUrl && (
            <Button
              type="text"
              danger
              onClick={uploadProps.onRemove}
              style={{ marginTop: 8, padding: 0 }}
            >
              Hapus atau Ganti Gambar
            </Button>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormSubject;
