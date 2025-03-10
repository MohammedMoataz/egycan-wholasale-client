import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Upload, message } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { createSubcategory, updateSubcategory } from "../../../api/categories";
import { EnhancedSubcategory } from "./AdminCategoriesPage";
import { Category } from "../../../types";

interface SubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  subcategory: EnhancedSubcategory | null;
  categories: Category[];
  selectedCategoryId: number | null;
  onSuccess: () => void;
}

const SubcategoryModal: React.FC<SubcategoryModalProps> = ({
  isOpen,
  onClose,
  subcategory,
  categories,
  selectedCategoryId,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (subcategory) {
        form.setFieldsValue({
          name: subcategory.name,
          description: subcategory.description || "",
          categoryId: subcategory.categoryId,
        });
        setImageUrl(subcategory.imageUrl || "");
      } else {
        form.resetFields();
        if (selectedCategoryId) {
          form.setFieldsValue({ categoryId: selectedCategoryId });
        }
        setImageUrl("");
        setImage(null);
      }
    }
  }, [isOpen, subcategory, form, selectedCategoryId]);

  const createSubcategoryMutation = useMutation({
    mutationFn: (formData: FormData) => createSubcategory(formData),
    onSuccess,
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Failed to create subcategory"
      );
    },
  });

  const updateSubcategoryMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateSubcategory(id, formData),
    onSuccess,
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Failed to update subcategory"
      );
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("categoryId", values.categoryId.toString());

      if (image) {
        formData.append("image", image);
      }

      if (subcategory) {
        updateSubcategoryMutation.mutate({ id: subcategory.id, formData });
      } else {
        createSubcategoryMutation.mutate(formData);
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setImageUrl("");
    setImage(null);
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

    setImage(file);
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
      title={subcategory ? "Edit Subcategory" : "Add New Subcategory"}
      open={isOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={
        createSubcategoryMutation.isPending ||
        updateSubcategoryMutation.isPending
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Subcategory Name"
          rules={[{ required: true, message: "Please enter subcategory name" }]}
        >
          <Input placeholder="Enter subcategory name" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} placeholder="Enter description" />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="Parent Category"
          rules={[
            { required: true, message: "Please select a parent category" },
          ]}
        >
          <Select placeholder="Select parent category">
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
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
                alt="subcategory"
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

export default SubcategoryModal;
