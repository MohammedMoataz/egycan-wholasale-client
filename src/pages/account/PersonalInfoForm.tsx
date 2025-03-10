import React from "react";
import { Form, Input, Button } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { PersonalInfo } from "../../types";

interface PersonalInfoFormProps {
  onNext: (data: PersonalInfo) => void;
  initialValues?: Partial<PersonalInfo>;
  loading?: boolean;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  onNext,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();

  const onFinish = (values: PersonalInfo) => {
    onNext(values);
  };

  return (
    <Form
      form={form}
      name="personalInfo"
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
      size="large"
      scrollToFirstError
    >
      <Form.Item
        name="fullName"
        label="Full Name"
        rules={[
          { required: true, message: "Please input your full name!" },
          { min: 2, message: "Name must be at least 2 characters long" },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="John Doe" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Please enter a valid email address!" },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="john@example.com" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[
          { required: true, message: "Please input your phone number!" },
          {
            pattern: /^\+?[1-9]\d{1,14}$/,
            message: "Please enter a valid phone number!",
          },
        ]}
      >
        <Input prefix={<PhoneOutlined />} placeholder="+1234567890" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: "Please input your password!" },
          { min: 6, message: "Password must be at least 6 characters" },
        ]}
        hasFeedback
      >
        <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Please confirm your password!" },
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
        <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Next
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PersonalInfoForm;
