import { Flex, Space } from "antd";
import Title from "antd/es/typography/Title";
import React, { useState } from "react";
import Add from "../../../../components/buttons/Add";
import TableData from "./TableData";
import Upload from "../../../../components/buttons/Upload";

const Parents = () => {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [parent, setParent] = useState({});

  const handleEdit = (record) => {
    setParent(record);
    console.log(record);
    setIsEdit(true);
    setOpen(true);
  };
  return (
    <Flex vertical gap={"middle"}>
      <Flex align="center" justify="space-between">
        <Title style={{ margin: 0 }} level={5}>
          Management Orang Tua
        </Title>

        <Space>
          <Upload />

          <Add />
        </Space>
      </Flex>

      <TableData onEdit={handleEdit} />
    </Flex>
  );
};

export default Parents;
