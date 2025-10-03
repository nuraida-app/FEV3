import { Card, Flex, Typography } from "antd";
import Add from "../../../../../components/buttons/Add";
import { useState } from "react";
import TableData from "./TableData";
import FormBranch from "./FormBranch";

const Branch = () => {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [branchData, setBranch] = useState({});

  const handleClose = () => {
    setBranch({});
    setOpen(false);
    setIsEdit(false);
  };

  const handleEdit = (record) => {
    setBranch(record);
    setIsEdit(true);
    setOpen(true);
  };
  return (
    <Card
      hoverable
      title="Managemen Rumpun"
      extra={<Add onClick={() => setOpen(true)} />}
    >
      <TableData onEdit={handleEdit} />

      <FormBranch
        title={isEdit ? "Edit Rumpun" : "Tambah Rumpun"}
        open={open}
        onClose={handleClose}
        branch={branchData}
      />
    </Card>
  );
};

export default Branch;
