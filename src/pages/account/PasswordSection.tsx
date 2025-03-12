import React, { useState } from "react";
import { Card, Typography, Button, Form, Input, Space } from "antd";
import { KeyOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "../../api/users";
import { message } from "antd";

const { Title, Text } = Typography;

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordSection: React.FC = () => {
  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const [form] = Form.useForm();

  const updatePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      updatePassword(data),
    onSuccess: () => {
      message.success("Password updated successfully");
      form.resetFields();
      setIsPasswordMode(false);
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Failed to update password"
      );
    },
  });

  const handleSubmit = (values: PasswordData) => {
    updatePasswordMutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  const cancelPasswordChange = () => {
    form.resetFields();
    setIsPasswordMode(false);
  };

  return (
    <Card className="password-card">
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <KeyOutlined
          style={{ fontSize: 24, color: "#faad14", marginRight: 16 }}
        />
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Password
          </Title>
          <Text type="secondary">Update your password</Text>
        </div>
      </div>

      {isPasswordMode ? (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[
              {
                required: true,
                message: "Please input your current password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please input your new password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={cancelPasswordChange}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updatePasswordMutation.isPending}
              >
                Update Password
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ) : (
        <Button type="primary" ghost onClick={() => setIsPasswordMode(true)}>
          Change Password
        </Button>
      )}
    </Card>
  );
};

export default PasswordSection;
