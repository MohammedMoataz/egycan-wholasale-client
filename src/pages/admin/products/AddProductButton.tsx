// src/pages/components/AddProductButton.tsx
import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface AddProductButtonProps {
  onClick: () => void;
}

const AddProductButton: React.FC<AddProductButtonProps> = ({ onClick }) => {
  return (
    <Button type="primary" icon={<PlusOutlined />} onClick={onClick}>
      Add Product
    </Button>
  );
};

export default AddProductButton;
