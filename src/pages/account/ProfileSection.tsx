import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Avatar,
  Badge,
  Typography,
  Space,
  Spin,
  Upload,
  message,
} from "antd";
import { UserOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { User } from "../../types";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";

const { Title, Text } = Typography;

interface ProfileSectionProps {
  user: User | null;
  isLoading: boolean;
  onUpdateProfile: (data: {
    name: string;
    phone: string;
    imageUrl?: string | null;
  }) => void;
  isUpdating: boolean;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  user,
  isLoading,
  onUpdateProfile,
  isUpdating,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleFinish = (values: { name: string; phone: string }) => {
    onUpdateProfile({
      ...values,
      imageUrl: imageUrl !== undefined ? imageUrl : user.imageUrl,
    });
    setIsEditMode(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setImageUrl(user.imageUrl);
    setIsEditMode(false);
  };

  const toggleEditMode = () => {
    form.setFieldsValue({
      name: user.name,
      phone: user.phone,
    });
    setImageUrl(user.imageUrl);
    setIsEditMode(!isEditMode);
  };

  // Mock upload function - in a real app, this would upload to your server
  const handleImageChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "done") {
      // This is where you'd normally get the URL from the server response
      // For now, we'll just use a placeholder URL
      setImageUrl(info.file.response?.url || "/default-profile.png");
      message.success(`${info.file.name} uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} upload failed.`);
    }
  };

  // For demo purposes - in a real app, you'd need to implement this
  const customRequest = ({ file, onSuccess }: any) => {
    setTimeout(() => {
      onSuccess("ok", file);
    }, 0);
  };

  return (
    <Card className="mb-6">
      <div style={{ marginBottom: 24 }}>
        <Space size={16} align="start">
          <Avatar
            size={64}
            src={user.imageUrl || undefined}
            icon={!user.imageUrl && <UserOutlined />}
            style={{ backgroundColor: !user.imageUrl ? "#1890ff" : undefined }}
          />
          <div>
            <Title level={4} style={{ marginBottom: 4 }}>
              {user.name}
            </Title>
            <Text type="secondary">{user.email}</Text>
            <div style={{ marginTop: 4 }}>
              <Text type="secondary">{user.phone}</Text>
            </div>
            <div style={{ marginTop: 8 }}>
              <Badge
                count={user.role === "admin" ? "Admin" : "Customer"}
                style={{
                  backgroundColor:
                    user.role === "admin" ? "#722ed1" : "#1890ff",
                  fontSize: "12px",
                  padding: "0 8px",
                }}
              />
            </div>
          </div>
        </Space>
      </div>

      {isEditMode ? (
        <Form
          form={form}
          layout="vertical"
          initialValues={{ name: user.name, phone: user.phone }}
          onFinish={handleFinish}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please enter your phone number" },
              {
                pattern: /^[0-9+-]+$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Email">
            <Input value={user.email} disabled />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Email cannot be changed
            </Text>
          </Form.Item>

          <Form.Item name="imageUrl" label="Profile Picture">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              customRequest={customRequest}
              onChange={handleImageChange}
            >
              {imageUrl || user.imageUrl ? (
                <img
                  src={imageUrl || user.imageUrl || "/default-profile.png"}
                  alt="avatar"
                  style={{ width: "100%" }}
                />
              ) : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ) : (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={toggleEditMode}
          style={{ padding: 0 }}
        >
          Edit Profile
        </Button>
      )}
    </Card>
  );
};

export default ProfileSection;
