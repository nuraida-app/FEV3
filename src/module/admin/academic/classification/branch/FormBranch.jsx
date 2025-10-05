import { Form, Input, Modal, Spin, message } from "antd";
import Cancel from "../../../../../components/buttons/Cancel";
import Save from "../../../../../components/buttons/Save";
import { useSaveBranchMutation } from "../../../../../service/api/main/ApiSubject";
import { useEffect } from "react";

const FormBranch = ({ open, onClose, branch, title }) => {
  const [form] = Form.useForm();

  const [saveBranch, { isLoading, isSuccess, data, error, reset }] =
    useSaveBranchMutation();

  const handleSubmit = (values) => {
    if (branch) {
      const data = { ...values, id: branch.id };
      saveBranch(data);
    } else {
      saveBranch(values);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (open) {
      form.resetFields();

      if (branch) {
        form.setFieldsValue({ name: branch.name });
      } else {
        form.resetFields();
      }
    }
  }, [open, branch, form]);

  useEffect(() => {
    if (isSuccess) {
      message.success(data.message);
      handleClose();
      reset();
    }

    if (error) {
      message.error(error.data.message);
      reset();
    }
  }, [isSuccess, data, error]);

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleClose}
      okText='Simpan'
      cancelText='Tutup'
      confirmLoading={isLoading}
      loading={isLoading}
      onOk={() => form.submit()}
    >
      <Spin spinning={isLoading} tip='Memperoses data..'>
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Form.Item
            name='name'
            label='Nama Kategori'
            rules={[{ required: true, message: "Nama Wajib diisi" }]}
          >
            <Input placeholder='Nama Kategori' />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default FormBranch;
