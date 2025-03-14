import React from "react";
import { Form, Input, Button, Space } from "antd";
import {
  ShopOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  LeftOutlined,
  BarcodeOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { BusinessInfo } from "../../types";

interface BusinessInfoFormProps {
  onPrevious: () => void;
  onFinish: (data: BusinessInfo) => void;
  initialValues?: Partial<BusinessInfo>;
  loading?: boolean;
}

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({
  onPrevious,
  onFinish,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: BusinessInfo) => {
    // Handle file upload if needed
    const businessData = {
      ...values,
    };

    onFinish(businessData);
  };

  return (
    <Form
      form={form}
      name="businessInfo"
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleFinish}
      size="large"
      scrollToFirstError
    >
      <Form.Item
        name="name"
        label="Business Name"
        rules={[
          { required: true, message: "Please input your business name!" },
        ]}
      >
        <Input prefix={<ShopOutlined />} placeholder="Company Name" />
      </Form.Item>

      <Form.Item
        name="legalName"
        label="Legal Business Name"
        rules={[
          { required: true, message: "Please input your legal business name!" },
        ]}
      >
        <Input prefix={<ShopOutlined />} placeholder="Legal Company Name" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Business Email"
        rules={[
          { required: true, message: "Please input your business email!" },
          { type: "email", message: "Please enter a valid email address!" },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="contact@company.com" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Business Phone"
        rules={[
          { required: true, message: "Please input your business phone!" },
          {
            pattern: /^\+?[1-9]\d{1,14}$/,
            message: "Please enter a valid phone number!",
          },
        ]}
      >
        <Input prefix={<PhoneOutlined />} placeholder="+1234567890" />
      </Form.Item>

      <Form.Item
        name="address"
        label="Street Address"
        rules={[
          { required: true, message: "Please input your street address!" },
        ]}
      >
        <Input prefix={<HomeOutlined />} placeholder="123 Business St" />
      </Form.Item>

      <Form.Item
        name="city"
        label="City"
        rules={[{ required: true, message: "Please input your city!" }]}
      >
        <Input prefix={<EnvironmentOutlined />} placeholder="City" />
      </Form.Item>

      <Form.Item
        name="province"
        label="Province/State"
        rules={[{ required: true, message: "Please input your province!" }]}
      >
        <Input prefix={<GlobalOutlined />} placeholder="Province" />
      </Form.Item>

      <Form.Item
        name="postalCode"
        label="Postal Code"
        rules={[
          { required: true, message: "Please input your postal code!" },
          {
            pattern: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
            message: "Please enter a valid Canadian postal code!",
          },
        ]}
      >
        <Input prefix={<BarcodeOutlined />} placeholder="A1A 1A1" />
      </Form.Item>

      <Form.Item>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Button onClick={onPrevious} icon={<LeftOutlined />}>
            Previous
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Complete Registration
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default BusinessInfoForm;
