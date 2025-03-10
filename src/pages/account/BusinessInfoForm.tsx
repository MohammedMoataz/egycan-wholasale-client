import React from "react";
import { Form, Input, Button, Select, Upload, Space } from "antd";
import {
  ShopOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  InboxOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { BusinessInfo } from "../../types";

const { Option } = Select;

interface BusinessInfoFormProps {
  onPrevious: () => void;
  onFinish: (data: BusinessInfo) => void;
  initialValues?: Partial<BusinessInfo>;
  loading?: boolean;
}

const businessTypes = [
  "Corporation",
  "Limited Liability Company (LLC)",
  "Partnership",
  "Sole Proprietorship",
  "Non-Profit Organization",
  "Other",
];

const provinces = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
];

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({
  onPrevious,
  onFinish,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: BusinessInfo) => {
    // Handle file upload if needed
    const documentFile = values.document?.fileList?.[0]?.originFileObj;
    const businessData = {
      ...values,
      document: documentFile,
    };

    onFinish(businessData);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
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
        rules={[{ required: true, message: "Please select your province!" }]}
      >
        <Select placeholder="Select province">
          {provinces.map((province) => (
            <Option key={province} value={province}>
              {province}
            </Option>
          ))}
        </Select>
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
        <Input placeholder="A1A 1A1" />
      </Form.Item>

      <Form.Item
        name="businessType"
        label="Business Type"
        rules={[
          { required: true, message: "Please select your business type!" },
        ]}
      >
        <Select placeholder="Select business type">
          {businessTypes.map((type) => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="website"
        label="Website"
        rules={[
          {
            pattern:
              /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
            message: "Please enter a valid URL!",
          },
        ]}
      >
        <Input
          prefix={<GlobalOutlined />}
          placeholder="https://www.company.com"
        />
      </Form.Item>

      <Form.Item
        name="document"
        label="Business Document"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[
          { required: true, message: "Please upload your business document!" },
        ]}
      >
        <Upload.Dragger
          name="files"
          beforeUpload={() => false}
          maxCount={1}
          accept=".pdf,.doc,.docx"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Upload business registration document (PDF, DOC, DOCX)
          </p>
        </Upload.Dragger>
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
