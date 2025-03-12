import React from "react";
import { Modal, Button, Space, Typography, Avatar } from "antd";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  business?: { name: string; email: string } | null;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  business,
  isLoading = false,
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      centered
      closable={false}
      footer={null}
      width={420}
    >
      <div className="py-2">
        <div className="flex items-start mb-4">
          <ExclamationCircleOutlined
            style={{ color: "#faad14", fontSize: 24 }}
            className="mr-4 mt-1"
          />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {title}
            </Title>
            <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
              {message}
            </Text>
          </div>
        </div>

        {business && (
          <div className="mt-4 mb-4 bg-gray-50 p-3 rounded-md border border-gray-200">
            <div className="flex items-center">
              <Avatar
                icon={<CheckCircleOutlined />}
                style={{ backgroundColor: "#e6f7ff", color: "#1890ff" }}
                className="mr-3"
                size="large"
              />
              <div>
                <Text strong>{business.name}</Text>
                <Text type="secondary" style={{ display: "block" }}>
                  {business.email}
                </Text>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Space>
            <Button disabled={isLoading} onClick={onClose}>
              {cancelText}
            </Button>
            <Button
              type="primary"
              disabled={isLoading}
              onClick={onConfirm}
              loading={isLoading}
            >
              {confirmText}
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
};
