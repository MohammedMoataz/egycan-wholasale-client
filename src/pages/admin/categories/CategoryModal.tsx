import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Upload, message } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { createCategory, updateCategory } from "../../../api/categories";
import { EnhancedCategory } from "../AdminCategoriesPage";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: EnhancedCategory | null;
  onSuccess: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (category) {
        form.setFieldsValue({
          name: category.name,
          description: category.description || "",
        });
        setImageUrl(category.imageUrl || "");
      } else {
        form.resetFields();
        setImageUrl("");
        setImageFile(null);
      }
    }
  }, [isOpen, category, form]);

  const createCategoryMutation = useMutation({
    mutationFn: (formData: FormData) => createCategory(formData),
    onSuccess,
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Failed to create category"
      );
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateCategory(id, formData),
    onSuccess,
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Failed to update category"
      );
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (category) {
        updateCategoryMutation.mutate({ id: category.id, formData });
      } else {
        createCategoryMutation.mutate(formData);
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setImageUrl("");
    setImageFile(null);
    onClose();
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return false;
    }

    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    return false; // Prevent automatic upload
  };

  const uploadButton = (
    <div>
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Modal
      title={category ? "Edit Category" : "Add New Category"}
      open={isOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={
        createCategoryMutation.isPending || updateCategoryMutation.isPending
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: "Please enter category name" }]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} placeholder="Enter description" />
        </Form.Item>

        <Form.Item label="Image">
          <Upload
            name="image"
            listType="picture-card"
            showUploadList={false}
            beforeUpload={beforeUpload}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="category"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryModal;
