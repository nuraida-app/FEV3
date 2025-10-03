import { useEffect, useState } from "react";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "../../../../../service/api/main/ApiSubject";
import { Dropdown, Modal, message } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import TableLayout from "../../../../../components/table/TableLayout";

const { confirm } = Modal;

const TableData = ({ onEdit }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetCategoriesQuery({ page, limit, search });
  const [
    deleteCategory,
    { data: delMessage, isLoading: delLoading, isSuccess, error },
  ] = useDeleteCategoryMutation();

  // Functions

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  const handleEdit = (record) => {
    onEdit(record);
  };

  const handleDelete = (id) => {
    confirm({
      title: "Apakah anda yakin menghapus data ini?",
      icon: <ExclamationCircleFilled />,
      content: "Data yang dihapus tidak bisa dikembalikan",
      okText: "Ya, Hapus",
      okType: "danger",
      cancelText: "Batal",
      onOk() {
        deleteCategory(id);
      },
      onCancel() {
        message.warning("Aksi dibatalkan");
      },
    });
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

  //   Effects
  useEffect(() => {
    if (isSuccess) {
      message.success(delMessage.message);
    }

    if (error) {
      message.error(error.data.message);
    }
  }, [delMessage, isSuccess, error]);

  const columns = [
    {
      title: "No",
      key: "no",
      render: (text, record, index) => (page - 1) * limit + index + 1,
    },
    { title: "Kategori", dataIndex: "name", key: "name" },
    {
      title: "Aksi",
      key: "action",
      render: (record) => (
        <Dropdown.Button
          menu={{
            items: [
              {
                key: "edit",
                label: "Edit",
              },
              {
                key: "detail",
                label: "Detail",
              },
              {
                key: "delete",
                label: "Hapus",
                danger: true,
              },
            ],

            onClick: ({ key }) => handleSelect(record, { key }),
          }}
        >
          Pilihan Aksi
        </Dropdown.Button>
      ),
    },
  ];

  return (
    <>
      <TableLayout
        onSearch={handleSearch}
        isLoading={isLoading || delLoading}
        columns={columns}
        source={data?.categories}
        rowKey="id"
        page={page}
        limit={limit}
        totalData={data?.totalData}
        onChange={handleTableChange}
      />
    </>
  );
};

export default TableData;
