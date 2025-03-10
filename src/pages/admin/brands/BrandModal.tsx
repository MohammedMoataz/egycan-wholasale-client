import React from "react";
import { Brand } from "../../../types";
import { Modal, Form, Input, Button, Upload, Space, Typography } from "antd";
import {
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  UploadOutlined,
  CloseOutlined,
  StarFilled,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";

const { TextArea } = Input;
const { Title } = Typography;

interface BrandModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string;
  setImagePreview: (preview: string) => void;
  currentBrand: Brand | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  createBrandMutation;
  updateBrandMutation;
}

const BrandModal: React.FC<BrandModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  formData,
  setFormData,
  handleSubmit,
  imagePreview,
  setImagePreview,
  currentBrand,
  createBrandMutation,
  updateBrandMutation,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue({
        name: formData.get("name"),
        description: formData.get("description"),
      });
    }
  }, [isModalOpen, formData, form]);

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const onFinish = (values: any) => {
    const newFormData = new FormData();
    formData.forEach((value, key) => {
      newFormData.append(key, value);
    });
    newFormData.set("name", values.name);
    newFormData.set("description", values.description || "");

    setFormData(newFormData);
    handleSubmit(new Event("submit") as any);
  };

  const handleFileChange: UploadProps["onChange"] = ({ file }) => {
    if (file.originFileObj) {
      const newFormData = new FormData();
      formData.forEach((value, key) => {
        newFormData.append(key, value);
      });
      newFormData.set("image", file.originFileObj);

      setFormData(newFormData);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    const newFormData = new FormData();
    formData.forEach((value, key) => {
      newFormData.append(key, value);
    });
    newFormData.delete("image");

    setFormData(newFormData);
  };

  const uploadFileList: UploadFile[] = imagePreview
    ? [
        {
          uid: "-1",
          name: "brand-image",
          status: "done",
          url: imagePreview,
          thumbUrl: imagePreview,
        },
      ]
    : [];

  const isLoading =
    createBrandMutation.isPending || updateBrandMutation.isPending;
  const modalTitle = currentBrand ? (
    <Space>
      <EditOutlined />
      Edit Brand
    </Space>
  ) : (
    <Space>
      <StarFilled />
      Add New Brand
    </Space>
  );

  return (
    <Modal
      title={modalTitle}
      open={isModalOpen}
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
          label="Brand Name"
          rules={[{ required: true, message: "Please enter brand name" }]}
        >
          <Input placeholder="Enter brand name" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea rows={3} placeholder="Enter brand description" />
        </Form.Item>

        <Form.Item label="Brand Image">
          <Upload
            listType="picture-card"
            fileList={uploadFileList}
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
              icon={currentBrand ? <SaveOutlined /> : <PlusOutlined />}
              loading={isLoading}
            >
              {currentBrand ? "Update Brand" : "Create Brand"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BrandModal;
