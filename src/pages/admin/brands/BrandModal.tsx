import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Upload,
  Space,
  Typography,
  message,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
  StarFilled,
  EditOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { Brand } from "../../../types";

const { TextArea } = Input;
const { Title } = Typography;

interface BrandModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleSubmit: (e: React.FormEvent) => void;
  imagePreview: string;
  setImagePreview: (preview: string) => void;
  currentBrand: Brand | null;
  createBrandMutation: any;
  updateBrandMutation: any;
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
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue({
        name: formData.get("name"),
        description: formData.get("description"),
      });

      if (imagePreview) {
        setFileList([
          {
            uid: "-1",
            name: "brand-image",
            status: "done",
            url: imagePreview,
            thumbUrl: imagePreview,
          },
        ]);
      } else {
        setFileList([]);
      }
    }
  }, [isModalOpen, formData, form, imagePreview]);

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

    if (fileList.length > 0 && fileList[0].originFileObj) {
      newFormData.set("image", fileList[0].originFileObj);
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
