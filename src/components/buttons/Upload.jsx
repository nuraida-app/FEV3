import { CloudUploadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

const Upload = ({ onClick }) => {
  return (
    <Button
      color="primary"
      variant="dashed"
      icon={<CloudUploadOutlined />}
      onClick={onClick}
    >
      Unggah
    </Button>
  );
};

export default Upload;
