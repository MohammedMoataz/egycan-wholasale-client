import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Form,
  Input,
  Alert,
  Space,
  Popconfirm,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { deleteAccount } from "../../api/users";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const { Title, Text } = Typography;

const DeleteAccountSection: React.FC = () => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const deleteAccountMutation = useMutation({
    mutationFn: (password: string) => deleteAccount(password),
    onSuccess: () => {
      message.success("Account deleted successfully");
      logout();
      navigate("/");
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Failed to delete account"
      );
    },
  });

  const handleSubmit = (values: { password: string }) => {
    deleteAccountMutation.mutate(values.password);
  };

  const cancelDelete = () => {
    form.resetFields();
    setIsDeleteMode(false);
  };

  return (
    <Card className="delete-account-card">
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <DeleteOutlined
          style={{ fontSize: 24, color: "#f5222d", marginRight: 16 }}
        />
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Delete Account
          </Title>
          <Text type="secondary">Permanently delete your account</Text>
        </div>
      </div>

      {isDeleteMode ? (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Alert
            message="Warning: This action cannot be undone"
            description="Once you delete your account, all your data will be permanently removed. This includes your profile, orders, and any other associated information."
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item
            name="password"
            label="Enter your password to confirm"
            rules={[
              {
                required: true,
                message: "Please input your password to confirm!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={cancelDelete}>Cancel</Button>
              <Popconfirm
                title="Delete Account"
                description="Are you sure you want to delete your account? This action cannot be undone."
                onConfirm={() => form.submit()}
                okText="Yes, Delete"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button danger loading={deleteAccountMutation.isPending}>
                  Delete Account
                </Button>
              </Popconfirm>
            </Space>
          </Form.Item>
        </Form>
      ) : (
        <Button danger onClick={() => setIsDeleteMode(true)}>
          Delete Account
        </Button>
      )}
    </Card>
  );
};

export default DeleteAccountSection;
