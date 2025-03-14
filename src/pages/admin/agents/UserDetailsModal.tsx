import React from "react";
import { Modal, Typography, Descriptions, Avatar, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { User } from "../../../types";

const { Title } = Typography;

interface UserDetailsModalProps {
  user: User;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  onClose,
}) => {
  return (
    <Modal
      title={<Title level={4}>Agent Details</Title>}
      open={true}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <Avatar
          size={64}
          icon={<UserOutlined />}
          src={user.imageUrl || undefined}
          style={{ marginRight: 16 }}
        />
        <div>
          <Title level={4} style={{ margin: 0 }}>
            {user.name}
          </Title>
          <div style={{ color: "rgba(0, 0, 0, 0.45)" }}>{user.email}</div>
        </div>
      </div>

      <Descriptions bordered column={1}>
        <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
        <Descriptions.Item label="Role">
          {user.role === "manager" ? (
            <Tag color="blue">Manager</Tag>
          ) : (
            <Tag color="green">Customer</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Profile Image">
          {user.imageUrl ? "Available" : "Not available"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default UserDetailsModal;
