import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Upload,
  Select,
  Space,
  Typography,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
  UserOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { User } from "../../../types";

const { Option } = Select;
const { Title } = Typography;

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  editUser?: User | null;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  editUser = null,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState<FormData>(new FormData());

  useEffect(() => {
    if (isOpen) {
      // Reset form data when modal opens
      const newFormData = new FormData();
      setFormData(newFormData);

      if (editUser) {
        form.setFieldsValue({
          name: editUser.name,
          email: editUser.email,
          phone: editUser.phone,
          role: editUser.role,
        });

        // Set initial form data values
        newFormData.set("name", editUser.name);
        newFormData.set("email", editUser.email);
        newFormData.set("phone", editUser.phone);
        newFormData.set("role", editUser.role);

        if (editUser.id) {
          newFormData.set("id", editUser.id.toString());
        }

        if (editUser.imageUrl) {
          setImagePreview(editUser.imageUrl);
          setFileList([
            {
              uid: "-1",
              name: "user-image",
              status: "done",
              url: editUser.imageUrl,
              thumbUrl: editUser.imageUrl,
            },
          ]);
        } else {
          setFileList([]);
          setImagePreview("");
        }
      } else {
        form.resetFields();
        setFileList([]);
        setImagePreview("");
      }

      setFormData(newFormData);
    }
  }, [isOpen, editUser, form]);

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setImagePreview("");
    setFormData(new FormData());
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const onFinish = (values: any) => {
    const newFormData = new FormData();
    formData.forEach((value, key) => {
      newFormData.append(key, value);
    });

    newFormData.set("name", values.name);
    newFormData.set("email", values.email);
    newFormData.set("phone", values.phone);
    newFormData.set("role", values.role);

    if (editUser?.id) {
      newFormData.set("id", editUser.id.toString());
    }

    setFormData(newFormData);
    handleSubmit(new Event("submit") as any);
  };

  const handleFileChange: UploadProps["onChange"] = ({ fileList }) => {
    setFileList(fileList);

    if (fileList.length > 0 && fileList[0].originFileObj) {
      const file = fileList[0].originFileObj;
      const newFormData = new FormData();

      formData.forEach((value, key) => {
        newFormData.append(key, value);
      });

      newFormData.set("image", file);
      setFormData(newFormData);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setFileList([]);

    const newFormData = new FormData();
    formData.forEach((value, key) => {
      if (key !== "image") {
        newFormData.append(key, value);
      }
    });

    setFormData(newFormData);
  };

  const modalTitle = editUser ? (
    <Space>
      <EditOutlined />
      Edit Agent
    </Space>
  ) : (
    <Space>
      <UserOutlined />
      Add New Agent
    </Space>
  );

  return (
    <Modal
      title={modalTitle}
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={520}
      destroyOnClose
      centered
      closeIcon={<CloseOutlined />}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter agent's name" }]}
        >
          <Input
            placeholder="Enter agent name"
            onChange={(e) => {
              const newFormData = new FormData();
              formData.forEach((value, key) => {
                newFormData.append(key, value);
              });
              newFormData.set("name", e.target.value);
              setFormData(newFormData);
            }}
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input
            placeholder="Enter email address"
            onChange={(e) => {
              const newFormData = new FormData();
              formData.forEach((value, key) => {
                newFormData.append(key, value);
              });
              newFormData.set("email", e.target.value);
              setFormData(newFormData);
            }}
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input
            placeholder="Enter phone number"
            onChange={(e) => {
              const newFormData = new FormData();
              formData.forEach((value, key) => {
                newFormData.append(key, value);
              });
              newFormData.set("phone", e.target.value);
              setFormData(newFormData);
            }}
          />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          initialValue="customer"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select
            placeholder="Select role"
            onChange={(value) => {
              const newFormData = new FormData();
              formData.forEach((value, key) => {
                newFormData.append(key, value);
              });
              newFormData.set("role", value);
              setFormData(newFormData);
            }}
          >
            <Option value="customer">Customer</Option>
            <Option value="manager">Manager</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Profile Image">
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleFileChange}
            onRemove={handleRemoveImage}
            maxCount={1}
            showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
          >
            {!imagePreview && (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={editUser ? <SaveOutlined /> : <PlusOutlined />}
              loading={isLoading}
            >
              {editUser ? "Update Agent" : "Create Agent"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
