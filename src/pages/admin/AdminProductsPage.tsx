// src/pages/AdminProductsPage.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout, Typography, Space, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getProducts } from "../../api/products";
import { getCategories } from "../../api/categories";
import { getBrands } from "../../api/brands";
import ProductsTable from "./products/ProductsTable";
import ProductFormModal from "./products/ProductFormModal";
import DeleteConfirmationModal from "./products/DeleteConfirmationModal";
import AddProductButton from "./products/AddProductButton";
import { Product } from "../../types";

const { Content } = Layout;
const { Title } = Typography;

const AdminProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentProduct, setCurrentProduct] = React.useState<Product | null>(
    null
  );

  // Fetch products
  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts({ page: 1, limit: 10 }),
  });

  // Fetch categories
  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(1, 10),
  });

  // Fetch brands
  const { data: brandsResponse } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrands(1, 10),
  });

  const products = productsResponse?.data || [];
  const categories = categoriesResponse?.data || [];
  const brands = brandsResponse?.data || [];

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreateModal = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentProduct(null);
  };

  return (
    <Content style={{ padding: "24px" }}>
      <div style={{ marginBottom: 24 }}>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Title level={2}>Products</Title>
          <AddProductButton onClick={handleOpenCreateModal} />
        </Space>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 24 }}>
        <Input
          placeholder="Search products..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      {/* Products Table */}
      <ProductsTable
        products={filteredProducts}
        loading={isLoading}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
      />

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={currentProduct}
        categories={categories}
        brands={brands}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        product={currentProduct}
      />
    </Content>
  );
};

export default AdminProductsPage;
