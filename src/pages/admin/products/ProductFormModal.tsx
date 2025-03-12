import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Checkbox,
  message,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct } from "../../../api/products";
import { getSubcategories } from "../../../api/categories";
import { Product, Category, Brand } from "../../../types";
import type { UploadFile } from "antd/es/upload/interface";

const { Option } = Select;
const { TextArea } = Input;

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  brands: Brand[];
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  product,
  categories,
  brands,
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [removeImages, setRemoveImages] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  // Reset form when product changes
  useEffect(() => {
    if (isOpen) {
      form.resetFields();

      if (product) {
        form.setFieldsValue({
          name: product.name,
          description: product.description,
          price: product.price,
          inStock: product.inStock,
          categoryId: product.categoryId,
          subcategoryId: product.subcategoryId,
          brandId: product.brandId,
        });

        setSelectedCategoryId(product.categoryId.toString());
        setRemoveImages(false);

        // Set fileList if there are images
        if (product.images && product.images.length > 0) {
          const images = product.images.map((img, index) => ({
            uid: `existing-${index}`,
            name: `Image ${index + 1}`,
            status: "done" as const,
            url: img.imageUrl,
          }));
          setFileList(images);
        } else {
          setFileList([]);
        }
      } else {
        setSelectedCategoryId("");
        setFileList([]);
      }
    }
  }, [isOpen, product, form]);

  // Fetch subcategories based on selected category
  const { data: subcategoriesResponse } = useQuery({
    queryKey: ["subcategories", selectedCategoryId],
    queryFn: () => getSubcategories(parseInt(selectedCategoryId)),
    enabled: !!selectedCategoryId,
  });
  const subcategories = subcategoriesResponse?.data;

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: (data: FormData) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      message.success("Product created successfully");
      onClose();
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Failed to create product"
      );
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      message.success("Product updated successfully");
      onClose();
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Failed to update product"
      );
    },
  });

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    form.setFieldsValue({ subcategoryId: undefined });
  };

  const handleFinish = (values: any) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price.toString());
    formData.append("inStock", values.inStock.toString());
    formData.append("categoryId", values.categoryId.toString());
    formData.append("subcategoryId", values.subcategoryId.toString());
    formData.append("brandId", values.brandId.toString());

    // Handle file uploads
    if (fileList.length > 0) {
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });
    }

    if (product?.id) {
      formData.append("removeImages", removeImages.toString());
      updateProductMutation.mutate({
        id: product.id,
        data: formData,
      });
    } else {
      createProductMutation.mutate(formData);
    }
  };

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const uploadProps = {
    onRemove: (file: UploadFile) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: File) => {
      // Check file type
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      // Check file size (limit to 5MB)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return false;
      }
      setFileList((prevFileList) => [...prevFileList, file as UploadFile]);
      return false;
    },
    fileList,
  };

  return (
    <Modal
      title={product ? "Edit Product" : "Add New Product"}
      open={isOpen}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={
        createProductMutation.isPending || updateProductMutation.isPending
      }
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          inStock: true,
        }}
      >
        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: "Please enter product name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "Please enter product description" },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter product price" }]}
            style={{ width: "50%" }}
          >
            <InputNumber
              min={0}
              step={0.01}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="inStock"
            label="In Stock"
            valuePropName="checked"
            style={{ width: "50%" }}
          >
            <Checkbox>Available in stock</Checkbox>
          </Form.Item>
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
            style={{ width: "33%" }}
          >
            <Select
              placeholder="Select category"
              onChange={handleCategoryChange}
              showSearch
              filterOption={(input, option) =>
                option?.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {categories?.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="subcategoryId"
            label="Subcategory"
            rules={[{ required: true, message: "Please select a subcategory" }]}
            style={{ width: "33%" }}
          >
            <Select
              placeholder="Select subcategory"
              disabled={!selectedCategoryId}
              showSearch
              filterOption={(input, option) =>
                option?.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {subcategories?.map((subcategory) => (
                <Option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="brandId" label="Brand" style={{ width: "33%" }}>
            <Select
              placeholder="Select brand"
              showSearch
              filterOption={(input, option) =>
                option?.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {brands?.map((brand) => (
                <Option key={brand.id} value={brand.id}>
                  {brand.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="images"
          label="Product Images"
          valuePropName="fileList"
          rules={[
            { required: true, message: "Please select at least one image" },
          ]}
          getValueFromEvent={() => fileList}
        >
          <Upload
            {...uploadProps}
            listType="picture-card"
            onChange={handleUploadChange}
            maxCount={5}
            multiple
          >
            {fileList.length >= 5 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        {product && product.images && product.images.length > 0 && (
          <Form.Item label="">
            <Checkbox
              checked={removeImages}
              onChange={(e) => setRemoveImages(e.target.checked)}
            >
              Replace existing images
            </Checkbox>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ProductFormModal;
