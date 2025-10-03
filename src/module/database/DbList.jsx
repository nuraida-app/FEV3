import React, { useState } from "react";
import {
  Button,
  Dropdown,
  Flex,
  Progress,
  Space,
  Typography,
  message,
} from "antd";
import { useGetDatabaseQuery } from "../../service/api/database/ApiDatabase";
import TableLayout from "../../components/table/TableLayout";
import { EditOutlined } from "@ant-design/icons";

const { Text } = Typography;

const conicColors = {
  "0%": "#ffccc7",
  "50%": "#ffe58f",
  "100%": "#87d068",
};

const DbList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetDatabaseQuery({ page, limit, search });

  //   Functions
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  const handleSelect = (record, { key }) => {
    switch (key) {
      case "edit":
        handleEdit(record);
        break;

      case "delete":
        handleDelete(record.id);
        break;

      default:
        break;
    }
  };

  const columns = [
    {
      title: "No",
      key: "no",
      render: (text, record, index) => (page - 1) * limit + index + 1,
    },
    {
      title: "Nama Siswa",
      dataIndex: "student_name",
      key: "student_name",
      render: (record, text) => (
        <Flex vertical gap={"small"}>
          <Text strong>{record}</Text>
          <Space>
            <small>
              {text.student_nis} • {text.student_grade} • {text.student_class}
            </small>
          </Space>
        </Flex>
      ),
    },
    {
      title: "L/P",
      dataIndex: "student_gender",
      key: "student_gender",
      render: (record) => (
        <Text>{record === "P" ? "Perempuan" : "Laki Laki"}</Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "completeness",
      key: "completeness",
      render: (record) => (
        <Progress percent={record} strokeColor={conicColors} />
      ),
    },
    {
      title: "Aksi",
      key: "action",
      render: (record) => (
        <Button type="primary" icon={<EditOutlined />}>
          Input Data
        </Button>
      ),
    },
  ];
  return (
    <TableLayout
      onSearch={handleSearch}
      isLoading={isLoading}
      columns={columns}
      source={data?.students}
      rowKey="student_id"
      page={page}
      limit={limit}
      totalData={data?.totalData}
      onChange={handleTableChange}
    />
  );
};

export default DbList;
