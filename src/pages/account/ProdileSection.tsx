import React, { useState } from "react";
import {
  Card,
  Avatar,
  Typography,
  Button,
  Form,
  Input,
  Space,
  Badge,
  Tag,
} from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../../api/users";
import { message } from "antd";
import { UserProfile } from "../../types";

const { Title, Text } = Typography;

interface ProfileSectionProps {
  user: UserProfile;
}

interface ProfileFormData {
  name: string;
  email: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      message.success("Profile updated successfully");
      setIsEditMode(false);
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Failed to update profile"
      );
    },
  });

  const handleSubmit = (values: ProfileFormData) => {
    updateProfileMutation.mutate(values);
  };

  const enterEditMode = () => {
    form.setFieldsValue({
      name: user.name,
      email: user.email,
    });
    setIsEditMode(true);
  };

  const cancelEdit = () => {
    form.resetFields();
    setIsEditMode(false);
  };

  return (
    <Card className="profile-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Badge count={user.role === "admin" ? "Admin" : null} color="blue">
            <Avatar
              size={64}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1890ff" }}
            />
          </Badge>

          {!isEditMode && (
            <div style={{ marginLeft: 16 }}>
              <Title level={4} style={{ margin: 0 }}>
                {user.name}
              </Title>
              <Text type="secondary">{user.email}</Text>
              <div style={{ marginTop: 8 }}>
                <Tag color={user.role === "admin" ? "purple" : "blue"}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Tag>
              </div>
            </div>
          )}
        </div>

        {!isEditMode && (
          <Button type="text" icon={<EditOutlined />} onClick={enterEditMode}>
            Edit Profile
          </Button>
        )}
      </div>

      {isEditMode && (
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 24 }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={cancelEdit}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updateProfileMutation.isPending}
              >
                Save Changes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export default ProfileSection;
