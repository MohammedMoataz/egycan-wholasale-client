import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBrand } from "../../api/brands";
import { getProducts } from "../../api/products";
import {
  Typography,
  Spin,
  Row,
  Col,
  Button,
  Space,
  Empty,
  Breadcrumb,
} from "antd";
import { Product } from "../../types";
import ProductGrid from "../../components/products/ProductGrid";
import ProductDetailsModal from "../../components/products/ProductDetailsModal";
import { useCartStore } from "../../store/cartStore";
import { notification } from "antd";

const { Title, Paragraph } = Typography;

// Default image to use when product image is not available
const DEFAULT_IMAGE =
  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";

const BrandPage: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addItem } = useCartStore();

  const brandIdNum = parseInt(brandId || "0", 10);

  const { data: brand, isLoading: brandLoading } = useQuery({
    queryKey: ["brand", brandIdNum],
    queryFn: () => getBrand(brandIdNum),
    enabled: !!brandIdNum,
  });

  const { data: productsResponse, isLoading: productsLoading } = useQuery({
    queryKey: ["products", { brandId: brandIdNum }],
    queryFn: () =>
      getProducts({
        page: 1,
        limit: 10,
        brandId: brandIdNum,
      }),
    enabled: !!brandIdNum,
  });

  const products = productsResponse?.data || [];

  // Process products to ensure they have images
  const processedProducts = products.map((product) => ({
    ...product,
    image: (product.images && product.images[0]?.imageUrl) || DEFAULT_IMAGE,
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

  if (brandLoading || productsLoading) {
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

  if (!brand) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <Title level={2}>Brand not found</Title>
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
          items={[{ title: <Link to="/">Home</Link> }, { title: brand.name }]}
        />

        <div>
          <Title level={2}>{brand.name}</Title>
          <Paragraph type="secondary">
            Browse all products from {brand.name}
          </Paragraph>
        </div>
      </Space>

      {/* Products Section */}
      {processedProducts.length > 0 ? (
        <ProductGrid
          products={processedProducts}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
        />
      ) : (
        <Empty
          description="No products found for this brand"
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

export default BrandPage;
