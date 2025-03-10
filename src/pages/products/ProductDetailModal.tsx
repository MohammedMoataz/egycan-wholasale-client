import React, { useState } from "react";
import {
  Modal,
  Typography,
  Tag,
  Carousel,
  Button,
  InputNumber,
  Divider,
  Row,
  Col,
  Space,
  notification,
} from "antd";
import {
  ShoppingCartOutlined,
  MinusOutlined,
  PlusOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { Product } from "../../types";
import { useNavigate } from "react-router-dom";

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (quantity: number) => void;
  isAuthenticated: boolean;
}

const { Title, Text, Paragraph } = Typography;

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isAuthenticated,
}) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleQuantityChange = (value: number | null) => {
    if (value !== null) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(quantity);
    onClose();
  };

  const redirectToLogin = () => {
    notification.info({
      message: "Authentication Required",
      description: "Please login to view product details",
      placement: "topRight",
    });
    onClose();
    navigate("/login");
  };

  // If not authenticated, redirect to login page or show login button
  if (!isAuthenticated) {
    return (
      <Modal
        title="Authentication Required"
        open={isOpen}
        onCancel={onClose}
        footer={[
          <Button key="cancel" onClick={onClose}>
            Cancel
          </Button>,
          <Button
            key="login"
            type="primary"
            icon={<LoginOutlined />}
            onClick={redirectToLogin}
          >
            Login
          </Button>,
        ]}
      >
        <p>Please login to view product details.</p>
      </Modal>
    );
  }

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
    >
      <Row gutter={[24, 0]}>
        {/* Product Images */}
        <Col xs={24} md={12}>
          {product.images && product.images.length > 0 ? (
            <>
              <div className="mb-4">
                <Carousel autoplay>
                  {product.images.map((image) => (
                    <div key={image.id}>
                      <div className="h-64 bg-gray-100 flex items-center justify-center">
                        <img
                          src={image.imageUrl}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </Carousel>
              </div>
            </>
          ) : (
            <div className="h-64 bg-gray-100 flex items-center justify-center">
              <Text type="secondary">No image available</Text>
            </div>
          )}
        </Col>

        {/* Product Details */}
        <Col xs={24} md={12}>
          <Title level={3}>{product.name}</Title>

          <div className="flex items-center mb-4">
            <Title level={4} className="text-indigo-600 mb-0 mr-4">
              ${product.price.toFixed(2)}
            </Title>
            <Tag
              color={product.inStock ? "success" : "error"}
              className="text-sm"
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </Tag>
          </div>

          <Divider />

          <div className="mb-4">
            <Space direction="vertical" size="small">
              <div>
                <Text strong>Brand:</Text> {product.brand?.name}
              </div>
              <div>
                <Text strong>Category:</Text> {product.category?.name}
              </div>
              <div>
                <Text strong>Subcategory:</Text> {product.subcategory?.name}
              </div>
            </Space>
          </div>

          <Divider />

          <div className="mb-6">
            <Title level={5}>Description</Title>
            <Paragraph>{product.description}</Paragraph>
          </div>

          {product.inStock && (
            <>
              <Divider />
              <div className="mb-4">
                <Text strong className="mr-4">
                  Quantity:
                </Text>
                <InputNumber
                  min={1}
                  max={99}
                  value={quantity}
                  onChange={handleQuantityChange}
                  addonBefore={
                    <MinusOutlined
                      onClick={() =>
                        handleQuantityChange(Math.max(1, quantity - 1))
                      }
                    />
                  }
                  addonAfter={
                    <PlusOutlined
                      onClick={() => handleQuantityChange(quantity + 1)}
                    />
                  }
                />
              </div>

              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                size="large"
                block
              >
                Add to Cart
              </Button>
            </>
          )}
        </Col>
      </Row>
    </Modal>
  );
};

export default ProductDetailModal;
