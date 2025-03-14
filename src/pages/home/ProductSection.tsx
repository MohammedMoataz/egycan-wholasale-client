import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Typography, Button, Tag } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Product } from "../../types";

const { Title, Text } = Typography;
const { Meta } = Card;

// Default placeholder image for products
const defaultProductImage =
  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";

interface ProductSectionProps {
  products: Product[];
}

const ProductSection: React.FC<ProductSectionProps> = ({ products }) => {
  return (
    <section
      className="mb-12"
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Title level={2} style={{ color: "#1d4ed8", margin: 0 }}>
          Featured Products
        </Title>
        <Link to="/products">
          <Button
            type="link"
            style={{
              color: "#1d4ed8",
              padding: 0,
              height: "auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            View All{" "}
            <RightOutlined
              style={{ fontSize: "0.875rem", marginLeft: "4px" }}
            />
          </Button>
        </Link>
      </div>

      <Row gutter={[24, 24]}>
        {products.slice(0, 4).map((product) => (
          <Col xs={24} sm={12} lg={6} key={product.id}>
            <Link to={`/products?id=${product.id}`}>
              <Card
                hoverable
                cover={
                  <div
                    style={{
                      height: "192px",
                      overflow: "hidden",
                      background: "#f3f4f6",
                    }}
                  >
                    {product.images && product.images[0] ? (
                      <img
                        alt={product.name}
                        src={product.images[0].imageUrl}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).onerror = null;
                          (e.target as HTMLImageElement).src =
                            defaultProductImage;
                        }}
                      />
                    ) : (
                      <img
                        alt={product.name}
                        src={defaultProductImage}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                }
                style={{ background: "#FAFAFA" }}
              >
                <Meta
                  title={
                    <span style={{ color: "#1e3a8a", fontWeight: 600 }}>
                      {product.name}
                    </span>
                  }
                  description={
                    <div>
                      <Text
                        type="secondary"
                        style={{ color: "#2563eb", fontSize: "0.875rem" }}
                      >
                        {product.brand?.name || "Brand N/A"}
                      </Text>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "8px",
                        }}
                      >
                        <Text
                          strong
                          style={{ color: "#1d4ed8", fontSize: "1rem" }}
                        >
                          ${product.price.toFixed(2)}
                        </Text>
                        <Tag color={product.inStock ? "success" : "error"}>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </Tag>
                      </div>
                    </div>
                  }
                />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default ProductSection;
