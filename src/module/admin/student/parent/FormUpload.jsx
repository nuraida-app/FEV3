import {
  Alert,
  Button,
  Divider,
  Flex,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useUploadParentsMutation } from "../../../../service/api/main/ApiParent";

const { Dragger } = Upload;
const { Text, Title } = Typography;

const previewColumns = [
  { title: "NIS", dataIndex: "nis", key: "nis" },
  { title: "NAMA ORANG TUA", dataIndex: "name", key: "name" },
  { title: "EMAIL", dataIndex: "email", key: "email" },
  {
    title: "KETERANGAN",
    dataIndex: "issue",
    key: "issue",
    render: (text) => <Tag color="red">{text}</Tag>,
  },
];

const FormUpload = ({ open, onClose }) => {
  const [file, setFile] = useState(null);
  const [validRows, setValidRows] = useState([]);
  const [incompleteRows, setIncompleteRows] = useState([]);
  const [duplicateRows, setDuplicateRows] = useState([]);

  const [uploadParents, { isLoading, isSuccess, error, data }] =
    useUploadParentsMutation();

  const handleDownload = () => {
    window.open("/template/template_orangtua.xlsx");
  };

  const resetState = () => {
    setFile(null);
    setValidRows([]);
    setIncompleteRows([]);
    setDuplicateRows([]);
  };

  const processFile = (file) => {
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const allRows = json.slice(1);

      const tempIncomplete = [];
      const tempComplete = [];

      allRows.forEach((row, index) => {
        const [nis, name, email] = row;
        const rowData = { key: `row-${index}`, nis, name, email };
        if (!nis || !name || !email) {
          tempIncomplete.push({ ...rowData, issue: "Kolom tidak lengkap" });
        } else {
          tempComplete.push(rowData);
        }
      });

      const seenNis = new Map();
      const seenEmail = new Map();
      const tempDuplicates = [];
      const tempUniques = [];

      tempComplete.forEach((row) => {
        let issues = [];
        if (seenNis.has(row.nis)) {
          issues.push("NIS duplikat");
          const originalRow = seenNis.get(row.nis);
          if (originalRow && !originalRow.issue.includes("NIS duplikat")) {
            originalRow.issue.push("NIS duplikat");
          }
        } else {
          seenNis.set(row.nis, row);
        }

        if (seenEmail.has(row.email)) {
          issues.push("Email duplikat");
          const originalRow = seenEmail.get(row.email);
          if (originalRow && !originalRow.issue.includes("Email duplikat")) {
            originalRow.issue.push("Email duplikat");
          }
        } else {
          seenEmail.set(row.email, row);
        }

        row.issue = issues;
      });

      tempComplete.forEach((row) => {
        if (row.issue.length > 0) {
          row.issue = row.issue.join(", ");
          tempDuplicates.push(row);
        } else {
          delete row.issue;
          tempUniques.push(row);
        }
      });

      setIncompleteRows(tempIncomplete);
      setDuplicateRows(tempDuplicates);
      setValidRows(tempUniques);
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  const handleSubmit = () => {
    if (validRows.length === 0) {
      message.error("Tidak ada data valid untuk diunggah.");
      return;
    }
    const dataToSubmit = {
      bulk: validRows.map((row) => [row.nis, row.name, row.email]),
    };
    uploadParents(dataToSubmit);
  };

  useEffect(() => {
    if (isSuccess) {
      message.success(data?.message || "Data orang tua berhasil diunggah");
      resetState();
      onClose();
    }
    if (error) {
      message.error(error?.data?.message || "Terjadi kesalahan");
    }
  }, [isSuccess, error, data, onClose]);

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);

  return (
    <Modal
      title="Unggah Data Orang Tua"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isLoading}
      okText={`Simpan (${validRows.length}) Data Valid`}
      cancelText="Tutup"
      width={800}
      okButtonProps={{ disabled: !file || validRows.length === 0 }}
      destroyOnHidden
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        {!file ? (
          <>
            <Alert
              message="Informasi Penting"
              description={
                <div>
                  Sistem akan memvalidasi dan memisahkan data. Hanya data unik
                  dengan kolom lengkap yang akan disimpan. Unduh{" "}
                  <a onClick={handleDownload} href="#">
                    template di sini
                  </a>
                  .
                </div>
              }
              type="info"
              showIcon
            />
            <Dragger
              name="file"
              multiple={false}
              beforeUpload={processFile}
              onRemove={resetState}
              accept=".xlsx"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Klik atau seret file ke area ini untuk mengunggah
              </p>
            </Dragger>
          </>
        ) : (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Flex justify="space-between" align="center">
              <Text>
                Total{" "}
                <Text strong>
                  {validRows.length +
                    duplicateRows.length +
                    incompleteRows.length}
                </Text>{" "}
                baris data ditemukan.
              </Text>
              <Button danger type="text" onClick={resetState}>
                Ganti File
              </Button>
            </Flex>

            <Divider orientation="left" plain>
              <Flex align="center" gap="small">
                <CheckCircleOutlined style={{ color: "green" }} />
                <Text>Data Valid & Unik</Text>
                <Tag color="success">{validRows.length}</Tag>
              </Flex>
            </Divider>
            <Table
              columns={previewColumns.filter((col) => col.key !== "issue")}
              dataSource={validRows}
              size="small"
              pagination={{ pageSize: 3 }}
            />

            {duplicateRows.length > 0 && (
              <>
                <Divider orientation="left" plain>
                  <Flex align="center" gap="small">
                    <ExclamationCircleOutlined style={{ color: "orange" }} />
                    <Text>Data Duplikat (Dilewati)</Text>
                    <Tag color="warning">{duplicateRows.length}</Tag>
                  </Flex>
                </Divider>
                <Table
                  columns={previewColumns}
                  dataSource={duplicateRows}
                  size="small"
                  pagination={{ pageSize: 3 }}
                />
              </>
            )}

            {incompleteRows.length > 0 && (
              <>
                <Divider orientation="left" plain>
                  <Flex align="center" gap="small">
                    <CloseCircleOutlined style={{ color: "red" }} />
                    <Text>Data Tidak Lengkap (Dilewati)</Text>
                    <Tag color="error">{incompleteRows.length}</Tag>
                  </Flex>
                </Divider>
                <Table
                  columns={previewColumns}
                  dataSource={incompleteRows}
                  size="small"
                  pagination={{ pageSize: 3 }}
                />
              </>
            )}
          </Space>
        )}
      </Space>
    </Modal>
  );
};

export default FormUpload;
