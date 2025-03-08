import React from "react";
import { Brand } from "../../../types";
import { Modal, Typography, Space, Button, Alert } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface DeleteModalProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  currentBrand: Brand | null;
  deleteBrandMutation: any;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  currentBrand,
  deleteBrandMutation,
}) => {
  const handleCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDelete = () => {
    if (currentBrand) {
      deleteBrandMutation.mutate(currentBrand.id);
    }
  };

  const isLoading = deleteBrandMutation.isPending;

  return (
    <Modal
      title={
        <Space>
          <DeleteOutlined style={{ color: "#f5222d" }} />
          <span>Confirm Delete</span>
        </Space>
      }
      open={isDeleteModalOpen && !!currentBrand}
      onCancel={handleCancel}
      maskClosable={!isLoading}
      closable={!isLoading}
      centered
      footer={null}
      width={420}
    >
      {currentBrand && (
        <>
          <Alert
            message={
              <Text>
                Are you sure you want to delete{" "}
                <Text strong type="danger">
                  {currentBrand.name}
                </Text>
                ? This action cannot be undone.
              </Text>
            }
            type="error"
            showIcon
            icon={<ExclamationCircleOutlined />}
            style={{ marginBottom: 24 }}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <Button onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              danger
              type="primary"
              onClick={handleDelete}
              loading={isLoading}
              icon={!isLoading && <DeleteOutlined />}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default DeleteModal;
