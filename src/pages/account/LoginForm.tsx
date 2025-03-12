import React from "react";
import { Form, Input, Button, Checkbox, Card, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import { useNavigate, useLocation } from "react-router-dom";
import { message } from "antd";

const { Title, Text } = Typography;

interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || "/";

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => login(data.email, data.password),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      message.success("Login successful!");
      navigate(from, { replace: true });
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    },
  });

  const onFinish = (values: LoginFormData) => {
    loginMutation.mutate(values);
  };

  return (
    <Card
      variant={false}
      className="login-card"
      style={{ maxWidth: 400, width: "100%", margin: "0 auto" }}
    >
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Title level={2}>Login to Your Account</Title>
      </div>

      <Form
        form={form}
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email address!" },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" allowClear />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            allowClear
          />
        </Form.Item>

        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Link to="/forgot-password" style={{ float: "right" }}>
            Forgot password?
          </Link>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loginMutation.isPending}
            block
          >
            Log in
          </Button>
        </Form.Item>

        <div style={{ textAlign: "center" }}>
          <Text>
            Don't have an account? <Link to="/register">Register now</Link>
          </Text>
        </div>
      </Form>
    </Card>
  );
};

export default LoginForm;
