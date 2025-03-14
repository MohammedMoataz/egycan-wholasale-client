import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Form,
  Input,
  Button,
  Card,
  message,
} from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../../api/auth";

const { Content } = Layout;
const { Title, Text } = Typography;

const CreateNewPasswordPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");

  // Extract email and verification code from URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    // const emailParam = searchParams.get("email");

    // if (emailParam) {
    //   setEmail(emailParam);
    //   form.setFieldsValue({ email: emailParam });
    // }

    console.log(code);
    if (code) {
      setVerificationCode(code);
    }

    if (!code) {
      message.error("Invalid verification link. Please register again.");
      // navigate("/register");
    }
  }, [location, form, navigate]);

  const createPasswordMutation = useMutation({
    mutationFn: (data: FormData) => updateUser(data),
    onSuccess: () => {
      message.success("Password created successfully! You can now log in.");
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message ||
          "Failed to create password. Please try again."
      );
    },
  });

  const handleSubmit = (values: {
    password: string;
    confirmPassword: string;
  }) => {
    createPasswordMutation.mutate({
      email,
      verificationCode,
      password: values.password,
    });
  };

  return (
    <Layout>
      <Content style={{ padding: "24px 0", minHeight: "100vh" }}>
        <Row justify="center" align="middle">
          <Col xs={24} sm={20} md={16} lg={12} xl={8}>
            <Card className="password-card">
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Title level={2}>Create New Password</Title>
                <Text>Set your account password to complete registration</Text>
              </div>

              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="email" label="Email">
                  <Input value={email} />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="New Password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your new password!",
                    },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password prefix={<LockOutlined />} />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
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
                  <Input.Password prefix={<LockOutlined />} />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={createPasswordMutation.isPending}
                    style={{ width: "100%" }}
                  >
                    Create Password
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default CreateNewPasswordPage;
