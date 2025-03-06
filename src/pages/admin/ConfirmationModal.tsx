import React, { useState } from "react";
import { Modal, Button, Space, Card, Avatar, Typography, Spin } from "antd";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

// Confirmation modal component using Ant Design
export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  user,
  isLoading = false,
}) => {
  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: "#faad14" }} />
          <span>{title}</span>
        </Space>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={onConfirm}
          loading={isLoading}
        >
          {confirmText}
        </Button>,
      ]}
      centered
    >
      <div>
        <Text type="secondary">{message}</Text>

        {user && (
          <Card
            style={{ marginTop: 16 }}
            size="small"
            bodyStyle={{ padding: 12 }}
          >
            <Space>
              <Avatar
                icon={<CheckCircleOutlined />}
                style={{
                  backgroundColor: "#e6f7ff",
                  color: "#1890ff",
                }}
              />
              <div>
                <Text strong>{user.name}</Text>
                <br />
                <Text type="secondary">{user.email}</Text>
              </div>
            </Space>
          </Card>
        )}
      </div>
    </Modal>
  );
};

// User approval button component using Ant Design
export const UserApprovalButton = ({ user, approveUserMutation }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleApprove = () => {
    approveUserMutation.mutate(user.id);
    setIsConfirmOpen(false);
  };

  return (
    <>
      <Button
        type="text"
        icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
        onClick={() => setIsConfirmOpen(true)}
        title="Approve"
      />

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleApprove}
        title="Approve User"
        message="Are you sure you want to approve this user? This action cannot be undone."
        confirmText="Approve"
        cancelText="Cancel"
        user={user}
        isLoading={approveUserMutation.isLoading}
      />
    </>
  );
};
