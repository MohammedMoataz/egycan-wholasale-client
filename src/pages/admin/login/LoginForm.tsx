// components/LoginForm.tsx
import React from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface LoginFormProps {
  onSubmit: (values: { email: string; password: string }) => void;
  loading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading }) => {
  const [form] = Form.useForm();

  const emailRules = [
    { required: true, message: "Email is required" },
    { type: "email", message: "Invalid email address" },
  ];

  const passwordRules = [{ required: true, message: "Password is required" }];

  return (
    <Card bordered={false} className="shadow-md">
      <div className="p-4">
        <Title level={2} className="text-center mb-6">
          Admin Login
        </Title>

        <Form
          form={form}
          name="adminLogin"
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          <Form.Item name="email" label="Email" rules={emailRules}>
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Admin email"
              size="large"
            />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={passwordRules}>
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Admin password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
              size="large"
            >
              {loading ? "Logging in..." : "Login as Admin"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
};
