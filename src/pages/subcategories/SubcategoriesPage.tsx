import React, { useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCategory, getSubcategories } from "../../api/categories";
import { getProducts } from "../../api/products";
import {
  Typography,
  Spin,
  Row,
  Col,
  Card,
  Button,
  Space,
  Empty,
  Breadcrumb,
  Divider,
  Pagination,
} from "antd";
import { Product } from "../../types";
import ProductGrid from "../../components/products/ProductGrid";
import ProductDetailsModal from "../../components/products/ProductDetailsModal";
import { useCartStore } from "../../store/cartStore";
import { notification } from "antd";

const { Title, Paragraph } = Typography;
const { Meta } = Card;

// Default image to use when product image is not available
const DEFAULT_IMAGE =
  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";

const SubcategoriesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addItem } = useCartStore();

  const categoryIdNum = parseInt(categoryId || "0", 10);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("limit") || "10", 10);

  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ["category", categoryIdNum],
    queryFn: () => getCategory(categoryIdNum),
    enabled: !!categoryIdNum,
  });

  const { data: subcategoriesResponse, isLoading: subcategoriesLoading } =
    useQuery({
      queryKey: ["subcategories", categoryIdNum],
      queryFn: () => getSubcategories(categoryIdNum),
      enabled: !!categoryIdNum,
    });

  const { data: productsResponse, isLoading: productsLoading } = useQuery({
    queryKey: [
      "products",
      { categoryId: categoryIdNum, page: currentPage, limit: pageSize },
    ],
    queryFn: () =>
      getProducts({
        page: currentPage,
        limit: pageSize,
        categoryId: categoryIdNum,
      }),
    enabled: !!categoryIdNum,
  });

  const subcategories = subcategoriesResponse?.data || [];
  const products = productsResponse?.data || [];
  const totalProducts = productsResponse?.meta?.totalNoOfPages || 0;

  // Process products to ensure they have images
  const processedProducts = products.map((product) => ({
    ...product,
    image: (product.images && product.images[0].imageUrl) || DEFAULT_IMAGE,
  }));

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    addItem(product, quantity);
    notification.success({
      message: "Added to cart",
      description: `${product.name} added to cart!`,
      placement: "bottomRight",
    });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setSearchParams({ page: page.toString(), limit: pageSize.toString() });
  };

  if (categoryLoading || subcategoriesLoading || productsLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!category) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <Title level={2}>Category not found</Title>
        <Link to="/">
          <Button type="primary">Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header with breadcrumb */}
      <Space
        direction="vertical"
        size="large"
        style={{ width: "100%", marginBottom: 32 }}
      >
        <Breadcrumb
          items={[
            { title: <Link to="/">Home</Link> },
            { title: category.name },
          ]}
        />

        <div>
          <Title level={2}>{category.name}</Title>
        </div>
      </Space>

      {/* Subcategories Section */}
      {subcategories.length > 0 && (
        <>
          <Title level={4}>Subcategories</Title>
          <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
            {subcategories.map((subcategory) => (
              <Col key={subcategory.id} xs={12} sm={8} md={6} lg={6}>
                <Link
                  to={`/products?categoryId=${categoryId}&subcategoryId=${subcategory.id}`}
                >
                  <Card
                    hoverable
                    style={{ height: "100%", padding: "12px 16px" }}
                  >
                    <Meta title={subcategory.name} />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
          <Divider />
        </>
      )}

      {/* Products Section */}
      <Title level={4}>Products in {category.name}</Title>
      {processedProducts.length > 0 ? (
        <>
          <ProductGrid
            products={processedProducts}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
          />

          {/* Pagination */}
          {totalProducts > pageSize && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 32,
              }}
            >
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalProducts}
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={["10", "20", "50"]}
              />
            </div>
          )}
        </>
      ) : (
        <Empty
          description="No products found in this category"
          style={{ margin: "48px 0" }}
        />
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={{
            ...selectedProduct,
            image:
              (selectedProduct.images && selectedProduct.images[0].imageUrl) ||
              DEFAULT_IMAGE,
          }}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToCart={(quantity) => handleAddToCart(selectedProduct, quantity)}
        />
      )}
    </div>
  );
};

export default SubcategoriesPage;
